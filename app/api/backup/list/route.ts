import { NextRequest, NextResponse } from "next/server";
import { readdir, stat } from "fs/promises";
import { join } from "path";

// Password for backup access
const BACKUP_PASSWORD = "736rsf3";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const password = searchParams.get('password');
  
  // Check password
  if (password !== BACKUP_PASSWORD) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    const backupDir = join(process.cwd(), 'public', 'backups');
    
    // Check if directory exists
    try {
      await stat(backupDir);
    } catch {
      // Directory doesn't exist, return empty list
      return NextResponse.json({ 
        files: [],
        totalBackups: 0,
        lastBackup: null
      });
    }
    
    const files = await readdir(backupDir);
    
    // Filter CSV files and get their stats
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    const fileStats = await Promise.all(
      csvFiles.map(async (file) => {
        const filePath = join(backupDir, file);
        const stats = await stat(filePath);
        return { 
          name: file, 
          size: Math.round(stats.size / 1024) + ' KB',
          date: stats.mtime.toISOString(),
          url: `/backups/${file}`
        };
      })
    );
    
    // Sort by modification time (newest first)
    fileStats.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return NextResponse.json({ 
      files: fileStats,
      totalBackups: fileStats.length,
      lastBackup: fileStats[0]?.date || null
    });
    
  } catch (error) {
    console.error('Error listing backups:', error);
    return NextResponse.json({ 
      error: 'Failed to list backups',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
