declare module 'sql.js' {
  export interface SqlJsDatabase {
    run(sql: string): void;
    exec(sql: string): Array<{columns: string[], values: any[][]}>;
    close(): void;
  }
  
  export interface SqlJs {
    Database: new () => SqlJsDatabase;
  }
  
  function initSqlJs(): Promise<SqlJs>;
  export default initSqlJs;
}