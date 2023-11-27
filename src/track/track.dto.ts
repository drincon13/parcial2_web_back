import {IsDate, IsNotEmpty, IsNumber, IsString, IsUrl} from 'class-validator';
export class TrackDto {

    @IsString()
    @IsNotEmpty()
    readonly id: string;

    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsNumber()
    @IsNotEmpty()
    readonly duration: number;

}
