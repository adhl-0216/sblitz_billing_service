import { DatabaseConnection } from '@/db/Connection';
import { SQLBuilder, PostgresSQLBuilder } from '@/db/SqlBuilder';
import { AbstractDatabaseFactory } from '@/db/Factory';
import { IDAO } from './IDAO';
import { Member } from '@/models/Member';
import { UUID } from 'crypto';

export class MemberDAO implements IDAO<Member> {
    private connection: DatabaseConnection;
    private sqlBuilder: SQLBuilder;

    constructor(databaseFactory: AbstractDatabaseFactory, config: any) {
        this.connection = databaseFactory.createConnection(config);
        this.sqlBuilder = new PostgresSQLBuilder();
    }

    async create(entity: Omit<Member, 'member_id'>): Promise<Member> {
        const columns = ['color_code'];
        const query = this.sqlBuilder.insert('members', columns);
        const values = [entity.color_code];

        const result = await this.connection.query(query, values);
        return this.mapRowToMember(result.rows[0]);
    }

    async update(id: string | number, entity: Partial<Member>): Promise<Member> {
        const columns = Object.keys(entity);
        const values = Object.values(entity);
        const query = this.sqlBuilder.update('members', columns, 'member_id = $' + (columns.length + 1));

        const result = await this.connection.query(query, [...values, id]);
        return this.mapRowToMember(result.rows[0]);
    }

    async delete(id: string | number): Promise<boolean> {
        const query = this.sqlBuilder.delete('members', 'member_id = $1');
        const result = await this.connection.query(query, [id]);
        return result.rowCount > 0;
    }

    async getAll(): Promise<Member[]> {
        const query = this.sqlBuilder.select('members', ['*']);
        const result = await this.connection.query(query);
        return result.rows.map(this.mapRowToMember);
    }

    async getById(id: string | number): Promise<Member> {
        const query = this.sqlBuilder.select('members', ['*'], 'member_id = $1');
        const result = await this.connection.query(query, [id]);
        if (result.rows.length === 0) {
            throw new Error('Member not found');
        }
        return this.mapRowToMember(result.rows[0]);
    }

    async getTotalMembers(): Promise<number> {
        const query = this.sqlBuilder.select('members', ['COUNT(*) as total']);
        const result = await this.connection.query(query);
        return parseInt(result.rows[0].total);
    }

    private mapRowToMember(row: any): Member {
        return {
            member_id: row.member_id as UUID,
            color_code: row.color_code
        };
    }
}