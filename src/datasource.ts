import { DataSource, DataSourceOptions } from 'typeorm';

let dataSource: DataSource | null = null;

export async function initializeDataSource(
  options: DataSourceOptions,
): Promise<DataSource> {
  if (dataSource) {
    return dataSource;
  }

  dataSource = new DataSource(options);
  await dataSource.initialize();
  return dataSource;
}
