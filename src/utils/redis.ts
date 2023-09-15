const upstashRedisUrl = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

type Command = 'zrange' | 'sismember' | 'get' | 'smembers'

export async function fetchRedis(command: Command, ...args: (string | number)[]) {
    const commandUrl = `${upstashRedisUrl}/${command}/${args.join('/')}`
    const res = await fetch(commandUrl, {
        headers: {
            Authorization: `Bearer ${token}`
        },
        cache: 'no-store'
    })

    if (!res.ok) {
        throw new Error('Error executing redis command')
    }

    const data = await res.json();
    return data.result;
}