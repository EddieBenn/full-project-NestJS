import { DataSource, DataSourceOptions } from 'typeorm';
import { addTransactionalDataSource } from 'typeorm-transactional';

let dataSource: DataSource | null = null;

export async function initializeDataSource(
  options: DataSourceOptions,
): Promise<DataSource> {
  if (dataSource) {
    return dataSource;
  }

  dataSource = addTransactionalDataSource(new DataSource(options));
  await dataSource.initialize();
  return dataSource;
}
