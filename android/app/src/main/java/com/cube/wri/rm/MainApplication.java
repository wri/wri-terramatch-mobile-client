package com.cube.wri.rm;

import com.brentvatne.react.ReactVideoPackage;
import com.cube.wri.rm.intents.IntentsPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.soloader.SoLoader;
import com.imagepicker.ImagePickerPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.lugg.ReactNativeConfig.ReactNativeConfigPackage;
import com.reactcommunity.rnlocalize.RNLocalizePackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactcommunity.rndatetimepicker.RNDateTimePickerPackage;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.webview.RNCWebViewPackage;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import com.rnfs.RNFSPackage;
import io.github.elyx0.reactnativedocumentpicker.DocumentPickerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
import io.sentry.RNSentryPackage;
import com.mapbox.rctmgl.RCTMGLPackage;
import com.reactnativecommunity.slider.ReactSliderPackage;
import com.vinzscam.reactnativefileviewer.RNFileViewerPackage;
import com.shahenlibrary.RNVideoProcessingPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends NavigationApplication
{
	@Override
	protected ReactGateway createReactGateway()
	{
		ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages())
		{
			@Override
			protected String getJSMainModuleName()
			{
				return "index";
			}
		};
		return new ReactGateway(this, isDebug(), host);
	}

	@Override
	public boolean isDebug()
	{
		return BuildConfig.DEBUG;
	}

	@Override
	public List<ReactPackage> createAdditionalReactPackages()
	{
		return Arrays.asList(
			new AsyncStoragePackage(),
			new DocumentPickerPackage(),
			new ImagePickerPackage(),
			new IntentsPackage(),
			new NetInfoPackage(),
			new RCTMGLPackage(),
			new ReactNativeConfigPackage(),
			new ReactSliderPackage(),
			new ReactVideoPackage(),
			new RNDeviceInfo(),
			new RNDateTimePickerPackage(),
			new RNFileViewerPackage(),
			new RNFirebaseAnalyticsPackage(),
			new RNFirebaseMessagingPackage(),
			new RNFirebaseNotificationsPackage(),
			new RNFirebasePackage(),
			new RNFSPackage(),
			new RNLocalizePackage(),
			new RNSentryPackage(),
			new RNVideoProcessingPackage(),
			new RNCWebViewPackage()
		);
	}

	@Override
	public void onCreate()
	{
		super.onCreate();
		SoLoader.init(this, /* native exopackage */ false);
	}
}
