import { firestore } from 'firebase-admin';
import { initFirebaseAdminSDK } from '@/config/firebase-admin-config';
import { NextRequest, NextResponse } from 'next/server';

initFirebaseAdminSDK();
const fsdb = firestore();

export async function GET() {
  try {
    const dashboardRef = fsdb.collection('dashboard_items');
    const snapshot = await dashboardRef.orderBy('createdAt', 'desc').get();
    
    const items = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ items });
  } catch (error) {
    console.error('Error fetching dashboard items:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard items' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        { error: 'Title and description are required' },
        { status: 400 }
      );
    }

    const dashboardRef = fsdb.collection('dashboard_items');
    const docRef = await dashboardRef.add({
      title: body.title,
      description: body.description,
      status: body.status || 'pending',
      createdAt: firestore.Timestamp.now()
    });

    return NextResponse.json({
      id: docRef.id,
      message: 'Item created successfully'
    });
  } catch (error) {
    console.error('Error creating dashboard item:', error);
    return NextResponse.json(
      { error: 'Failed to create dashboard item' },
      { status: 500 }
    );
  }
}