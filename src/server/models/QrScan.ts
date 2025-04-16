
import { pool } from '../index';

export class QrScan {
  static async create(scan: { scanned_by: string; scanned_data: any; ip_address: string }) {
    const result = await pool.query(
      'INSERT INTO qr_scans (scanned_by, scanned_data, ip_address) VALUES ($1, $2, $3) RETURNING *',
      [scan.scanned_by, scan.scanned_data, scan.ip_address]
    );
    return result.rows[0];
  }

  static async findByScannerId(scannerId: string) {
    const result = await pool.query('SELECT * FROM qr_scans WHERE scanned_by = $1 ORDER BY created_at DESC', [scannerId]);
    return result.rows;
  }
}
