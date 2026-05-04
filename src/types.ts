/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'student' | 'instructor' | 'admin';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor_id: number;
  instructor_name?: string;
  created_at: string;
}

export interface Enrollment {
  id: number;
  student_id: number;
  course_id: number;
  progress: number;
  enrolled_at: string;
  course_title?: string;
  description?: string;
}

export interface Recommendation {
  id: number;
  student_id: number;
  recommended_course: string;
  reason: string;
  created_at: string;
}

export interface PerformanceRecord {
  id: number;
  student_id: number;
  course_id: number;
  score: number;
  engagement_level: 'low' | 'medium' | 'high';
}
