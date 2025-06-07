import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Boostage, BoostageStatusEnum } from './schemas/boostage.schema';
import { Model, Types } from 'mongoose';
import { CreateBoostageDto } from './dto/create-boostage.dto';
import { PaymentService } from '../payments/payment.service';
import { User } from '../users/schemas/users.schema';
import { SearchEtablissementDto } from '../etablissement/dtos/search-etablissement.dto';

@Injectable()
export class BoostageService {

    constructor(
        private readonly paymentService: PaymentService,
        @InjectModel(Boostage.name) private boostageModel: Model<Boostage>,
        @InjectModel(User.name) private userModel: Model<User>,
    ) { }

    async create(userId: string, createBoostageDto: CreateBoostageDto) {

        const user = await this.userModel.findOne({ _id: new Types.ObjectId(userId) });

        if (!user) {
            throw new NotFoundException('Utilisateur introuvable.');
        }

        const totalPrice = this.calculateCost(createBoostageDto.date_debut, createBoostageDto.date_fin);

        const boostage = await this.boostageModel.create({
            ...createBoostageDto,
            userId,
            etablissement: new Types.ObjectId(createBoostageDto.etablissement)
        });

        const payment = await this.paymentService.payBoostage(
            createBoostageDto.paymentMethod,
            boostage,
            user,
            totalPrice
        )

        return { boostage, payment };
    }

    async getRandomBoostedEtablissements(searchEtablissementDto: SearchEtablissementDto) {

        const { longitude, latitude, page, limit, nom, category, distance } = searchEtablissementDto;

        const pipeline = [];

        const today = new Date();

        pipeline.push(
            {
                $match: {
                    status: BoostageStatusEnum.PAID,
                    date_debut: { $lte: today },
                    date_fin: { $gte: today },
                },
            },
            {
                $lookup: {
                    from: 'etablissements',
                    localField: 'etablissement',
                    foreignField: '_id',
                    as: 'etablissement',
                },
            },
            {
                $unwind: '$etablissement',
            },
            {
                $lookup: {
                    from: 'categories',
                    localField: 'etablissement.category',
                    foreignField: '_id',
                    as: 'etablissement.category',
                },
            },
            {
                $unwind: {
                    path: '$etablissement.category',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    options: {
                        $map: {
                            input: "$options",
                            as: "optionId",
                            in: { $convert: { input: "$$optionId", to: "objectId" } }
                        }
                    }
                }
            },
            {
                $lookup: {
                    from: 'options',
                    localField: 'etablissement.options',
                    foreignField: '_id',
                    as: 'etablissement.options',
                },
            },
            {
                $lookup: {
                    from: 'media',
                    localField: 'etablissement.images',
                    foreignField: '_id',
                    as: 'etablissement.images',
                },
            },
            {
                $sample: { size: 10 },
            },
        );

        const boostages = await this.boostageModel.aggregate(pipeline).exec();

        return boostages.map(bo => bo.etablissement);
    }

    calculateCost(startDate: any, endDate: any) {
        const start = new Date(startDate);
        const end = new Date(endDate);
        //@ts-ignore
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24))
        return (days * 1); // 1€ par jour
    };
}
