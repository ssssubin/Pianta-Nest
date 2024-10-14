import { Injectable } from "@nestjs/common";
import * as mysql from "mysql2/promise";

@Injectable()
export class MySqlService {
   private pool: mysql.Pool;

   constructor() {
      // db 연결 설정
      this.pool = mysql.createPool({
         host: "127.0.0.1",
         port: 3306,
         user: process.env.DB_USER,
         password: process.env.DB_PASSWORD,
         database: "pianta",
      });
   }

   // user 테이블 생성
   async createUserTable() {
      const sql = `CREATE TABLE IF NOT EXISTS users(
               email VARCHAR(255) PRIMARY KEY, 
               name VARCHAR(255) NOT NULL, 
               password VARCHAR(255) NOT NULL, 
               address VARCHAR(255) NOT NULL, 
               phone_number VARCHAR(20) NOT NULL, 
               is_admin TINYINT(1) DEFAULT 0, 
               is_user TINYINT(1) DEFAULT 1, 
               update_lock TINYINT(1) DEFAULT 1
               )`;
      await this.pool.execute(sql);
   }

   // guest 테이블 생성
   async createGuestTable() {
      const sql = `CREATE TABLE IF NOT EXISTS guests(
         order_number VARCHAR(10) PRIMARY KEY,
         email VARCHAR(255) NOT NULL,
         name VARCHAR(255) NOT NULL,
         password VARCHAR(255) NOT NULL,
         phone_number VARCHAR(20) NOT NULL
         )`;
      await this.pool.execute(sql);
   }

   // 대분류 카테고리 테이블 생성
   async createCategoryTable() {
      const sql = `CREATE TABLE IF NOT EXISTS categories(
         number INT(1) PRIMARY KEY,
         name VARCHAR(30) NOT NULL
      )`;
      await this.pool.execute(sql);
   }

   // 회원 찾는 method
   async findUser(email: string) {
      const sql = `SELECT * FROM users WHERE email = '${email}';`;
      const [user] = await this.pool.execute(sql);
      return user;
   }

   // query 실행하는 method
   async query(sql: string, params: any[] = []) {
      // MySQL 쿼리 실행하고 결과 반환
      const [rows] = await this.pool.execute(sql, params);
      return rows;
   }
}