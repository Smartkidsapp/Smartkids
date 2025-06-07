import { tmpdir } from 'os';
import { join, resolve } from 'path';

export const TMP_DIR = tmpdir();
export const APP_DIR = resolve(__dirname, '../../../');
export const TEMPLATES_DIR = join(APP_DIR, 'templates');
export const UPLOAD_BASE_DIR = 'public';
export const UPLOAD_DIR = join(APP_DIR, UPLOAD_BASE_DIR);

export const INVOICES_DIR = join(APP_DIR, 'uploads', 'invoices');

console.log({ UPLOAD_BASE_DIR, TEMPLATES_DIR, UPLOAD_DIR, INVOICES_DIR });
