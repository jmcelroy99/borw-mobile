package com.borw;

import android.content.Intent;
import android.os.Bundle;
import androidx.appcompat.app.AppCompatActivity;

public class SplashActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        try {
            //  Block of code to try
            super.onCreate(savedInstanceState);

            Intent intent = new Intent(this, MainActivity.class);

            // Pass along FCM messages/notifications etc.
            Bundle extras = getIntent().getExtras();
            if (extras != null) {
                intent.putExtras(extras);
            }
            startActivity(intent);
            finish();
        }
        catch(Exception e) {
            //  Block of code to handle errors
            System.out.println(e.getMessage());
        }
    }
}