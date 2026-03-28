export class Company {

    constructor(
        public readonly id: string,
        public name: string,
        public readonly email: string,
        public phone: string | null,
        public isActive: boolean,
        public readonly createdAt: Date,
        public employeeCount: number
    ) {

    }

}