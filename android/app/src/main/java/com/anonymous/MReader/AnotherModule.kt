package com.anonymous.MReader

import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class AnotherModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "AnotherModule"
    }

    @ReactMethod
    fun greet(name: String, promise: Promise) {
        promise.resolve("Olá, $name! Este é outro módulo nativo.")
    }
}