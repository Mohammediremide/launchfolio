import "next-auth";
declare module "next-auth/jwt" { interface JWT { githubAccessToken?: string } }
