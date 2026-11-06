import { Body, Controller, Get, Param, ParseIntPipe, Post, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { EmailService } from 'src/email/email.service';
import { CreateLostPetDto } from './dtos/lost-pet.dto';
import { generateLostPetTemplate } from './templates/lost-pet-template';
import { BodyRespone } from './dtos/body.respose.dto';
import { LostPetsService } from './lost-pets.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { StorageService } from 'src/storage/storage.service';
import { File } from 'buffer';


@UseGuards(AuthGuard)

@Controller('lost-pets')
export class LostPetsController {
    constructor(
        private emailService:EmailService,
        private losPetService: LostPetsService,
        private storageService: StorageService
    ){}

    @Get()
    async getAllLostPets(){
        const response: BodyRespone = {
            status: 200,
            error: false,
            errorMessage: undefined,
            data: undefined
        }
        try{
            const lostPets = await this.losPetService.getAllPets();
            response.data = lostPets;
            return response;
        }
        catch(e){
            response.status = 500;
            response.error = true;
            response.errorMessage = "Ocurio un error";
            return response;
        }
    }

    @Post()
     @UseInterceptors(FileInterceptor('image', {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
    }))
    async createLostPet(
        @Body() createLostPetDto: CreateLostPetDto,
        @UploadedFile() file: any 
    ){
        const response: BodyRespone = {
            status: 200,
            error: false,
            errorMessage: undefined,
            data: undefined
        }
        try{
            const url = await this.storageService.uploadFile(file,"pets");
            const template = generateLostPetTemplate(createLostPetDto,url);
            await this.emailService.sendEmail(template);
            const lostPet = await this.losPetService.createLosPet(createLostPetDto,url);
            response.data = lostPet;
            return response;
        }
        catch(e){
            response.status = 500;
            response.error = true;
            response.errorMessage = "Ocurio un error";
            return response;
        }
    }

    @Post(':id/image')
        @UseInterceptors(FileInterceptor('image', {
        limits: { fileSize: 5 * 1024 * 1024 },
        fileFilter: (req, file, cb) => cb(null, file.mimetype.startsWith('image/'))
    }))
    async uploadLostPetImage(
        @Param('id',ParseIntPipe) id:number,
        @UploadedFile() file: any
    ){
        const url = await this.storageService.uploadFile(file,'pets');
        return { 
            url: url
        }
    }
}