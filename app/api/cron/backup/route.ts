import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { writeFile, readdir, unlink } from "fs/promises";
import { join } from "path";

// Helper function to convert data to CSV
function arrayToCSV(data: Record<string, unknown>[], headers: string[]): string {
  const csvHeaders = headers.join(',');
  const csvRows = data.map(row => 
    headers.map(header => {
      const value = row[header];
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`;
      }
      return value;
    }).join(',')
  );
  return [csvHeaders, ...csvRows].join('\n');
}

// Helper function to cleanup old backups (keep only 3 latest)
async function cleanupOldBackups() {
  try {
    const backupDir = join(process.cwd(), 'public', 'backups');
    const files = await readdir(backupDir);
    
    // Filter CSV files and sort by creation time (newest first)
    const csvFiles = files.filter(file => file.endsWith('.csv'));
    const fileStats = await Promise.all(
      csvFiles.map(async (file) => {
        const filePath = join(backupDir, file);
        const stats = await import('fs').then(fs => fs.promises.stat(filePath));
        return { file, mtime: stats.mtime };
      })
    );
    
    // Sort by modification time (newest first) and keep only 3
    fileStats.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
    
    // Delete files beyond the 3rd one
    for (let i = 3; i < fileStats.length; i++) {
      const filePath = join(backupDir, fileStats[i].file);
      await unlink(filePath);
      console.log(`🗑️ Deleted old backup: ${fileStats[i].file}`);
    }
  } catch (error) {
    console.error('Error cleaning up old backups:', error);
  }
}

export async function GET(req: NextRequest) {
  // Verify this is a Vercel Cron request
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  
  try {
    // Create backup directory if it doesn't exist
    const backupDir = join(process.cwd(), 'public', 'backups');
    await import('fs').then(fs => fs.promises.mkdir(backupDir, { recursive: true }));
    
    // Generate timestamp for filename
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0] + '_' + 
                     new Date().toISOString().replace(/[:.]/g, '-').split('T')[1].split('.')[0];
    
    // Fetch all data from database
    const [boatEvents, expenses, wishlistItems] = await Promise.all([
      prisma.boatEvent.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.expense.findMany({
        orderBy: { createdAt: 'desc' }
      }),
      prisma.wishlistItem.findMany({
        orderBy: { createdAt: 'desc' }
      })
    ]);
    
    // Convert to CSV format
    const boatEventsCSV = arrayToCSV(boatEvents, [
      'id', 'title', 'start', 'end', 'allDay', 'owner', 'createdAt', 'updatedAt'
    ]);
    
    const expensesCSV = arrayToCSV(expenses, [
      'id', 'description', 'amountCents', 'date', 'paidBy', 'createdAt'
    ]);
    
    const wishlistCSV = arrayToCSV(wishlistItems, [
      'id', 'title', 'url', 'description', 'proposedBy', 'createdAt'
    ]);
    
    // Write CSV files
    const files = [
      { name: `${timestamp}_boat-events.csv`, content: boatEventsCSV },
      { name: `${timestamp}_expenses.csv`, content: expensesCSV },
      { name: `${timestamp}_wishlist.csv`, content: wishlistCSV }
    ];
    
    for (const file of files) {
      const filePath = join(backupDir, file.name);
      await writeFile(filePath, file.content, 'utf8');
      console.log(`💾 Created automatic backup: ${file.name}`);
    }
    
    // Cleanup old backups
    await cleanupOldBackups();
    
    return NextResponse.json({ 
      success: true, 
      message: 'Automatic backup created successfully',
      files: files.map(f => f.name),
      timestamp,
      records: {
        boatEvents: boatEvents.length,
        expenses: expenses.length,
        wishlistItems: wishlistItems.length
      }
    });
    
  } catch (error) {
    console.error('Automatic backup error:', error);
    return NextResponse.json({ 
      error: 'Automatic backup failed', 
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
