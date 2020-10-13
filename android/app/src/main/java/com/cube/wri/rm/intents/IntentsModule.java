package com.cube.wri.rm.intents;

import android.content.Context;
import android.content.Intent;
import android.widget.Toast;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import static android.content.Intent.FLAG_ACTIVITY_NEW_TASK;

public class IntentsModule extends ReactContextBaseJavaModule
{
	public IntentsModule(ReactApplicationContext reactContext)
	{
		super(reactContext);
	}

	@Override
	public String getName()
	{
		return "Intents";
	}

	@ReactMethod
	public void launchEmailClient()
	{
		final Context context = getReactApplicationContext();

		Intent intent = new Intent(Intent.ACTION_MAIN);
		intent.addCategory(Intent.CATEGORY_APP_EMAIL);
		intent.setFlags(FLAG_ACTIVITY_NEW_TASK);
		if (intent.resolveActivity(context.getPackageManager()) != null)
		{
			Intent chooserIntent = Intent.createChooser(intent, "Select email app");
			chooserIntent.setFlags(FLAG_ACTIVITY_NEW_TASK);
			context.startActivity(chooserIntent);
		}
		else
		{
			Toast.makeText(context, "There is no email client installed on this device", Toast.LENGTH_LONG).show();
		}
	}
}
