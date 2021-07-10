import { get } from 'lodash';
import { SessionDocument } from './../model/session.model';
import config from 'config';
import { FilterQuery, LeanDocument, UpdateQuery } from "mongoose";
import Session from "../model/session.model";
import { UserDocument } from "../model/user.model";
import { decode, sign } from '../utils/jwt.utils';
import { findUser } from './user.service';

export async function createSession(userId: string, userAgent: string) {
    const session = await Session.create({ user: userId, userAgent });

    return session.toJSON();
}

export async function createAccessToken({ user, session }: {
    user:
    | Omit<UserDocument, 'password'>
    | LeanDocument<Omit<UserDocument, 'password'>>;
    session:
    | Omit<SessionDocument, 'password'>
    | LeanDocument<Omit<SessionDocument, 'password'>>
}) {
    const accesstoken = sign({ ...user, sesion: session._id },
        { expiresIn: config.get('accessTokenTtl') });

    return accesstoken;
}


export async function reIssueAccessToken({
    refreshToken,
}: {
    refreshToken: string;
}) {
    // Decode the refresh token
    const { decoded } = decode(refreshToken);

    if (!decoded || !get(decoded, "_id")) return false;

    // Get the session
    const session = await Session.findById(get(decoded, "_id"));

    // Make sure the session is still valid
    if (!session || !session?.valid) return false;

    const user = await findUser({ _id: session.user });

    if (!user) return false;

    const accessToken = createAccessToken({ user, session });

    return accessToken;
}

export async function updateSession(
    query: FilterQuery<SessionDocument>,
    update: UpdateQuery<SessionDocument>
) {
    return Session.updateOne(query, update);
}

export async function findSessions(query: FilterQuery<SessionDocument>) {
    return Session.find(query).lean();
}