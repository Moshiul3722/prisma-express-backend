import bcrypt from "bcryptjs";
import { prisma } from "../../lib/prisma";
import { ILogingUser } from "./interface";
import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../config";
import { jwtUtils } from "../../utils/jwt";

const loginUser = async (payload: ILogingUser) => {
  const { email, password } = payload;

  const user = await prisma.user.findUniqueOrThrow({
    where: { email },
  });

  const isPasswordMatched = await bcrypt.compare(password, user.password);

  if (!isPasswordMatched) {
    throw new Error("Password is incorrect");
  }

  const jwtPayload = {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  };

  //   const accessToken = jwt.sign(jwtPayload, config.jwt_access_secret, {
  //     expiresIn: config.jwt_access_expires_in,
  //   } as SignOptions);

  const accessToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_access_secret,
    config.jwt_access_expires_in as SignOptions,
  );

  //   const refreshToken = jwt.sign(jwtPayload, config.jwt_refresh_secret, {
  //     expiresIn: config.jwt_refresh_expires_in,
  //   } as SignOptions);

  const refreshToken = jwtUtils.createToken(
    jwtPayload,
    config.jwt_refresh_secret,
    config.jwt_refresh_expires_in as SignOptions,
  );

  return {
    accessToken,
    refreshToken,
  };
};

export const authService = {
  loginUser,
};
