import 'reflect-metadata'
import { Entity, Log } from './index'
import { Company } from '@domain/entities/Company'

const tableName = Reflect.getMetadata('tableName', Company)
console.log(tableName) //


class TestRepository {
    @Log()
    async findById(id: string) {
        return { id, name: 'Test Company' }
    }
}

const repo = new TestRepository()
repo.findById('123')