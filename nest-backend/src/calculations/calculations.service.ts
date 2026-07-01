import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Calculation } from './schemas/calculation.schema';
import { CreateCalculationDto } from './dto/create-calculation.dto';

@Injectable()
export class CalculationsService {
  constructor(
    @InjectModel(Calculation.name) private calculationModel: Model<Calculation>,
  ) {}

  async create(createCalculationDto: CreateCalculationDto, userId: string) {
    const { expression } = createCalculationDto;

    try {
      // 1. Solve the giant math string (e.g. "5+5*10/2" becomes 30)
      const mathResult = eval(expression);

      // Check for impossible math (like dividing by zero)
      if (!isFinite(mathResult) || isNaN(mathResult)) {
        throw new Error('Math error');
      }

      // 2. Save it to the database
      const newCalculation = new this.calculationModel({
        userId,
        expression,
        result: mathResult,
      });

      return await newCalculation.save();
    } catch (error) {
      // If eval() crashes because they typed something like "7++*", we catch it safely!
      throw new BadRequestException('Invalid mathematical expression');
    }
  }

  async findAll(
    userId: string, 
    page: number = 1, 
    limit: number = 5, 
    search: string = '', 
    sort: string = 'desc'
  ) {
    const skip = (page - 1) * limit;

    // Filter by the logged-in user, and optionally by the search bar text
    const query: any = { userId };
    if (search) {
      query.expression = { $regex: search, $options: 'i' };
    }

    // Determine sort order based on the frontend dropdown
    const sortOrder = sort === 'asc' ? 1 : -1;

    // Fetch the specific page of data from MongoDB
    const history = await this.calculationModel
      .find(query)
      .sort({ createdAt: sortOrder })
      .skip(skip)
      .limit(limit)
      .exec();

    // Count the total number of records to tell React how many pages there are
    const total = await this.calculationModel.countDocuments(query);

    return {
      history,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    };
  }

  async remove(id: string, userId: string) {
    // We strictly require the userId so a hacker can't delete someone else's math!
    return await this.calculationModel.findOneAndDelete({ _id: id, userId });
  }

  async removeAll(userId: string) {
    // Clears the history only for the logged-in user
    return await this.calculationModel.deleteMany({ userId });
  }
}