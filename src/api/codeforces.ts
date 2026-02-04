import type { CFApiResponse, CFUser, CFSubmission } from '../types';

/**
 * Codeforces API 封装
 * 限制：每 2 秒最多 5 次请求
 */

const API_BASE = '/api/cf';

// 请求队列，用于限流
class RequestQueue {
  private queue: (() => void)[] = [];
  private lastRequestTime = 0;
  private readonly minInterval = 400; // 400ms = 2秒/5次

  async enqueue<T>(requestFn: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const now = Date.now();
          const elapsed = now - this.lastRequestTime;
          if (elapsed < this.minInterval) {
            await this.sleep(this.minInterval - elapsed);
          }
          this.lastRequestTime = Date.now();
          const result = await requestFn();
          resolve(result);
        } catch (error) {
          reject(error);
        }
      });
      this.processQueue();
    });
  }

  private async processQueue() {
    if (this.queue.length === 0) return;
    const request = this.queue.shift();
    if (request) {
      await request();
      // 继续处理队列中的下一个请求
      if (this.queue.length > 0) {
        setTimeout(() => this.processQueue(), this.minInterval);
      }
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

const requestQueue = new RequestQueue();

/**
 * 发送 API 请求
 */
async function fetchApi<T>(url: string): Promise<CFApiResponse<T>> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
}

/**
 * 获取用户信息
 * @param handles 用户名列表（最多 10000 个）
 */
export async function getUserInfo(handles: string[]): Promise<CFUser[]> {
  if (handles.length === 0) return [];
  
  const handlesParam = handles.join(';');
  const url = `${API_BASE}/user.info?handles=${encodeURIComponent(handlesParam)}`;
  
  const data = await requestQueue.enqueue(() => fetchApi<CFUser[]>(url));
  
  if (data.status !== 'OK') {
    throw new Error(data.comment || '获取用户信息失败');
  }
  
  return data.result || [];
}

/**
 * 获取用户提交记录
 * @param handle 用户名
 * @param from 从第几条开始（1-based）
 * @param count 获取数量（最大 100000）
 */
export async function getUserStatus(
  handle: string,
  from = 1,
  count = 100
): Promise<CFSubmission[]> {
  const url = `${API_BASE}/user.status?handle=${encodeURIComponent(handle)}&from=${from}&count=${count}`;
  
  const data = await requestQueue.enqueue(() => fetchApi<CFSubmission[]>(url));
  
  if (data.status !== 'OK') {
    throw new Error(data.comment || '获取提交记录失败');
  }
  
  return data.result || [];
}

/**
 * 获取多个用户的今日提交记录
 * @param handles 用户名列表
 * @returns 每个用户的今日提交记录
 */
export async function getUsersTodaySubmissions(
  handles: string[]
): Promise<Map<string, CFSubmission[]>> {
  const result = new Map<string, CFSubmission[]>();
  
  // 获取当前 UTC+8 时间的起止时间戳
  const now = new Date();
  const utc8Offset = 8 * 60 * 60 * 1000; // UTC+8 偏移量（毫秒）
  
  // 计算今日 UTC+8 的开始和结束时间
  const today = new Date(now.getTime() + utc8Offset);
  today.setUTCHours(0, 0, 0, 0);
  const todayStartSeconds = Math.floor((today.getTime() - utc8Offset) / 1000);
  const todayEndSeconds = todayStartSeconds + 24 * 60 * 60;
  
  // 依次查询每个用户（避免触发限流）
  for (const handle of handles) {
    try {
      const submissions = await getUserStatus(handle, 1, 50);
      
      // 筛选今日提交记录
      const todaySubmissions = submissions.filter(
        sub => sub.creationTimeSeconds >= todayStartSeconds && sub.creationTimeSeconds < todayEndSeconds
      );
      
      result.set(handle, todaySubmissions);
    } catch (error) {
      console.error(`获取用户 ${handle} 的提交记录失败:`, error);
      result.set(handle, []);
    }
  }
  
  return result;
}

/**
 * 获取多个用户在指定日期范围内的提交记录
 * @param handles 用户名列表
 * @param startDate 开始日期 (YYYY-MM-DD)
 * @param endDate 结束日期 (YYYY-MM-DD)
 * @returns 每个用户的提交记录
 */
export async function getUsersSubmissionsByDateRange(
  handles: string[],
  startDate: string,
  endDate: string
): Promise<Map<string, CFSubmission[]>> {
  const result = new Map<string, CFSubmission[]>();
  
  // 将日期转换为 UTC+8 的时间戳
  const start = new Date(startDate + 'T00:00:00+08:00');
  const end = new Date(endDate + 'T23:59:59+08:00');
  
  const startSeconds = Math.floor(start.getTime() / 1000);
  const endSeconds = Math.floor(end.getTime() / 1000);
  
  // 依次查询每个用户
  for (const handle of handles) {
    try {
      // 获取更多提交记录以确保覆盖日期范围
      const submissions = await getUserStatus(handle, 1, 100);
      
      // 筛选指定日期范围内的提交记录
      const filteredSubmissions = submissions.filter(
        sub => sub.creationTimeSeconds >= startSeconds && sub.creationTimeSeconds <= endSeconds
      );
      
      result.set(handle, filteredSubmissions);
    } catch (error) {
      console.error(`获取用户 ${handle} 的提交记录失败:`, error);
      result.set(handle, []);
    }
  }
  
  return result;
}

/**
 * 格式化时间戳为本地时间字符串
 */
export function formatTime(seconds: number): string {
  const date = new Date(seconds * 1000);
  return date.toLocaleString('zh-CN', {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
}

/**
 * 格式化日期
 */
export function formatDate(seconds: number): string {
  const date = new Date(seconds * 1000);
  return date.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric',
  });
}
