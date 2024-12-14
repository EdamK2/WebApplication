'use client';

import { SessionProvider } from 'next-auth/react';

export default function NextAuthSessionProvider({ children }) {
    return <SessionProvider projectId="P2p2RP2CqItyTEXfP8SFryAd2FnD">{children}</SessionProvider>;
}