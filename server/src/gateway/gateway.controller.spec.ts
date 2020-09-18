import { Test, TestingModule } from '@nestjs/testing';

import { GatewaysController } from './gateway.controller';
import { GatewaysService } from './gateway.service';
import { getModelToken } from '@nestjs/mongoose';
import { GatewayDoc } from './schemas/gateway.schema';
import { Gateway } from './interfaces/gateway.interface';


describe('GatewayController', () => {
  let gatewaysController: GatewaysController;
  let gatewaysService: GatewaysService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [GatewaysController],
      providers: [
        GatewaysService,
        {
          provide: getModelToken(GatewayDoc.name),
          useValue: GatewayDoc,
        },
      ],
    }).compile();

    gatewaysService = app.get<GatewaysService>(GatewaysService);
    gatewaysController = app.get<GatewaysController>(GatewaysController);
  });

  describe('findAll', () => {
    it('should return "Hello World!"', async () => {

      const result: Gateway[] = [
        {
          age: 1,
          breed: '123',
          name: 'Hola'
        }
      ];

      jest.spyOn(gatewaysService, 'getAll').mockImplementation(async () => result);

      expect(await gatewaysController.getGateways()).toBe(result);

    });
  });

});

