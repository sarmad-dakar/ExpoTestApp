package com.anonymous.marsasports.trustpayments;


import android.app.Activity;
import android.content.Intent;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
public class TrustPaymentsModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;

    public TrustPaymentsModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.reactContext = reactContext;
    }

    @NonNull
    @Override
    public String getName() {
        return "TrustPaymentsModule"; // Name to be used in React Native
    }

    @ReactMethod
    public void processGooglePay(Promise promise) {
        // TODO: Implement Google Pay logic with Trust Payments SDK
        promise.resolve("Google Pay Processing Started");
    }


}