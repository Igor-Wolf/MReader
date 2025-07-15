package com.anonymous.MReader

import com.facebook.react.bridge.*
import okhttp3.MediaType.Companion.toMediaTypeOrNull
import okhttp3.RequestBody.Companion.toRequestBody
import java.io.IOException
import java.util.concurrent.TimeUnit

// EXPLICIT IMPORTS FOR OKHTTP CALLBACK, CALL, and RESPONSE
import okhttp3.Callback // <--- ADD THIS LINE
import okhttp3.Call     // <--- ADD THIS LINE
import okhttp3.Response // <--- ADD THIS LINE
import okhttp3.OkHttpClient // <--- ADD THIS LINE (if not already there)
import okhttp3.Request // <--- ADD THIS LINE (if not already there)


class RequestHttpModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    // Configura o cliente OkHttpClient uma vez para reutilização
    private val client = OkHttpClient.Builder()
        .connectTimeout(30, TimeUnit.SECONDS) // Tempo limite de conexão
        .readTimeout(30, TimeUnit.SECONDS)    // Tempo limite de leitura
        .writeTimeout(30, TimeUnit.SECONDS)   // Tempo limite de escrita
        .build()

    override fun getName(): String {
        return "RequestHttpModule"
    }

    /**
     * Realiza uma requisição HTTP GET.
     * @param url A URL para a requisição.
     * @param headersMap Um ReadableMap contendo os cabeçalhos da requisição (chave-valor).
     * @param promise A Promise para resolver ou rejeitar a requisição no JS.
     */
    @ReactMethod
    fun get(url: String, headersMap: ReadableMap?, promise: Promise) {
        val requestBuilder = Request.Builder().url(url)

        headersMap?.toHashMap()?.forEach { (key, value) ->
            if (value is String) {
                requestBuilder.addHeader(key, value)
            }
        }

        val request = requestBuilder.build()

        // Agora o compilador sabe exatamente qual 'Callback' estamos usando
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                promise.reject("NETWORK_ERROR", "Erro de rede: ${e.message}", e)
            }

            override fun onResponse(call: Call, response: Response) {
                try {
                    val responseBody = response.body?.string()
                    val responseMap = Arguments.createMap().apply {
                        putInt("status", response.code)
                        putString("body", responseBody)
                        val headers = Arguments.createMap()
                        response.headers.forEach { header ->
                            headers.putString(header.first, header.second)
                        }
                        putMap("headers", headers)
                    }
                    promise.resolve(responseMap)
                } catch (e: Exception) {
                    promise.reject("RESPONSE_PARSE_ERROR", "Erro ao processar resposta: ${e.message}", e)
                } finally {
                    response.body?.close() // Fechar o corpo da resposta
                }
            }
        })
    }

    /**
     * Realiza uma requisição HTTP POST.
     * @param url A URL para a requisição.
     * @param bodyString O corpo da requisição como uma String (ex: JSON).
     * @param headersMap Um ReadableMap contendo os cabeçalhos da requisição (chave-valor).
     * @param promise A Promise para resolver ou rejeitar a requisição no JS.
     */
    @ReactMethod
    fun post(url: String, bodyString: String?, headersMap: ReadableMap?, promise: Promise) {
        val mediaType = "application/json; charset=utf-8".toMediaTypeOrNull()

        val body = bodyString?.toRequestBody(mediaType)
            ?: "".toRequestBody(mediaType)

        val requestBuilder = Request.Builder()
            .url(url)
            .post(body)

        headersMap?.toHashMap()?.forEach { (key, value) ->
            if (value is String) {
                requestBuilder.addHeader(key, value)
            }
        }

        val request = requestBuilder.build()

        // Agora o compilador sabe exatamente qual 'Callback' estamos usando
        client.newCall(request).enqueue(object : Callback {
            override fun onFailure(call: Call, e: IOException) {
                promise.reject("NETWORK_ERROR", "Erro de rede: ${e.message}", e)
            }

            override fun onResponse(call: Call, response: Response) {
                try {
                    val responseBody = response.body?.string()
                    val responseMap = Arguments.createMap().apply {
                        putInt("status", response.code)
                        putString("body", responseBody)
                        val headers = Arguments.createMap()
                        response.headers.forEach { header ->
                            headers.putString(header.first, header.second)
                        }
                        putMap("headers", headers)
                    }
                    promise.resolve(responseMap)
                } catch (e: Exception) {
                    promise.reject("RESPONSE_PARSE_ERROR", "Erro ao processar resposta: ${e.message}", e)
                } finally {
                    response.body?.close()
                }
            }
        })
    }
}