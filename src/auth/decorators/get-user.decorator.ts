import { createParamDecorator, ExecutionContext } from "@nestjs/common";


export const GetUser = createParamDecorator((data: string | undefined, ctx: ExecutionContext) => {
    const request: Express.Request = ctx.switchToHttp().getRequest();

    //check if data is passed
    if(!request.user) return null;
    if(data) {
        return request.user[data];
    }
    return request.user;
})