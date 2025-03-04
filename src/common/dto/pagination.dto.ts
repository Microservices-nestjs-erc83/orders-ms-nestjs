
// como quiero que se vean los argumentos similar a los dto de creacion
import { Type } from 'class-transformer'
import { IsOptional, IsPositive } from "class-validator"

export class PaginationDto {

    @IsPositive()
    @IsOptional()
    @Type( () => Number )
    page?: number = 1


    @IsPositive()
    @IsOptional()
    @Type( () => Number )
    limit?: number = 10

}




