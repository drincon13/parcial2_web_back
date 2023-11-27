import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class PerformerDto {

    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly description: string;
    
    @IsString()
    @IsNotEmpty()
    readonly image: string;

}
