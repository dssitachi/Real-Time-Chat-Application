import { NextAuthOptions } from 'next-auth';
import { db } from './db';
import { UpstashRedisAdapter } from "@next-auth/upstash-redis-adapter";
import GooogleProvider from "next-auth/providers/google";
import { fetchRedis } from '@/utils/redis';

function getGoogleCredentials() {
    const clientId = process.env.GOOGLE_CLIENT_ID
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET

    if(!clientId || clientId.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_ID')
    }
    if(!clientSecret || clientSecret.length === 0) {
        throw new Error('Missing GOOGLE_CLIENT_SECRET')
    }

    return {
        clientId, clientSecret
    }
}

export const authOptions: NextAuthOptions = {
    adapter: UpstashRedisAdapter(db),
    providers: [
        GooogleProvider({
            clientId: getGoogleCredentials().clientId,
            clientSecret: getGoogleCredentials().clientSecret
        })
    ],
    session: {
        strategy: 'jwt'
    },
    pages: {
        signIn: '/login'
    },
    callbacks: {
        async jwt({token, user}) {
            const response = (await fetchRedis('get', `user:${token.id}`)) as string | null
            if(!response) {
                token.id = user!.id
                return token
            }
            const dbUser = JSON.parse(response) as User
            return {
                id: dbUser.id,
                name: dbUser.name,
                email: dbUser.email,
                picture: dbUser.image
            }
        },
        async session({session, token}) {
            if(token) {
                session.user.id = token.id
                session.user.email = token.email
                session.user.name = token.name
                session.user.image = token.picture
            }
            return session
        },
        redirect() {
            return '/dashboard'
        }
    }
}