import api from './api';

export async function uploadImage(uri: string): Promise<string> {
  const formData = new FormData();
  const name = uri.split('/').pop() || `photo-${Date.now()}.jpg`;
  const match = /\.(\w+)$/.exec(name);
  const type = match ? `image/${match[1].toLowerCase()}` : 'image/jpeg';

  formData.append('image', { uri, name, type } as any);

  const response = await api.post<{ url: string }>('/upload/image', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data.url;
}

export async function uploadFile(
  uri: string,
  name: string,
  mimeType?: string
): Promise<{ url: string; name: string }> {
  const formData = new FormData();
  formData.append('file', {
    uri,
    name,
    type: mimeType || 'application/octet-stream',
  } as any);

  const response = await api.post<{ url: string; name: string }>('/upload/file', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
}
