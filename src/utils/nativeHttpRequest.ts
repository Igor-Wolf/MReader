// src/utils/NativeHttpUtils.ts
import { NativeModules } from 'react-native';

const { RequestHttpModule } = NativeModules;

// --- Tipagem do Módulo Nativo ---
interface NativeHttpHeaders {
  [key: string]: string;
}

interface NativeHttpResponse {
  status: number;
  body: string | null;
  headers: NativeHttpHeaders;
}

interface RequestHttpModuleInterface {
  get(url: string, headers?: NativeHttpHeaders): Promise<NativeHttpResponse>;
  post(url: string, body: string, headers?: NativeHttpHeaders): Promise<NativeHttpResponse>;
}

// Acessa o módulo nativo usando o nome definido no Kotlin (getName())
const MyRequestHttpModule: RequestHttpModuleInterface = RequestHttpModule;

// --- Funções Auxiliares para Requesições HTTP ---

export async function fetchWithNativeGet(
  url: string,
  headers?: NativeHttpHeaders
): Promise<NativeHttpResponse> {
  try {
    const response = await MyRequestHttpModule.get(url, headers);
    return response;
  } catch (error: any) {
    console.error('Error in native GET request:', error.code, error.message);
    throw error;
  }
}

export async function fetchWithNativePost(
  url: string,
  body: string,
  headers?: NativeHttpHeaders
): Promise<NativeHttpResponse> {
  try {
    const response = await MyRequestHttpModule.post(url, body, headers);
    return response;
  } catch (error: any) {
    console.error('Error in native POST request:', error.code, error.message);
    throw error;
  }
}