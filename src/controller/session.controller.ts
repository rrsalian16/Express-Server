import config from 'config';
import { Request, Response } from 'express';
import { get } from 'lodash';
import log from '../logger';
import { createAccessToken, createSession, findSessions, updateSession } from '../service/session.service';
import { validatePasword } from '../service/user.service';
import { sign } from '../utils/jwt.utils';


export async function createUsersessionHandler(req: Request, res: Response) {

    log.info(req.body)
    const user = await validatePasword(req.body);

    if (!user) {
        return res.status(401).send("Invalid username or password");
    }

    const session = await createSession(user._id, req.get('user-agent') || "");

    const accessToken = createAccessToken({ user, session });

    const refreshToken = sign({ session, expiresIn: config.get('refreshTokenTtl') })

    return res.send({ accessToken, refreshToken });
}


export async function invalidateUserSerssionHandler(req: Request, res: Response) {
    const sessionId = get(req, 'user.session');

    await updateSession({ _id: sessionId }, { valid: false });

    return res.sendStatus(200);
}


export async function getUserSessionHandler(req: Request, res: Response) {
    const userId = get(req, 'user._id');
    const sessions = await findSessions({ user: userId, valid: true });
    return res.send(sessions);
}
