import {IsDate, IsNotEmpty, IsString, IsUrl} from 'class-validator';
export class AlbumDto {

    @IsString()
    @IsNotEmpty()
    readonly id: string;

    @IsString()
    @IsNotEmpty()
    readonly name: string;
    
    @IsString()
    @IsNotEmpty()
    readonly description: string;
    
    @IsString()
    @IsNotEmpty()
    readonly cover: string;
    
    @IsDate()
    @IsNotEmpty()
    readonly releaseDate: string;
    
}
