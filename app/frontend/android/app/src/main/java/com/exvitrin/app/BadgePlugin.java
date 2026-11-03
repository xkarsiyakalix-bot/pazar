package com.exvitrin.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import me.leolin.shortcutbadger.ShortcutBadger;

@CapacitorPlugin(name = "Badge")
public class BadgePlugin extends Plugin {

    private void cancelAllNotifications(Context context) {
        try {
            NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
            if (notificationManager != null) {
                notificationManager.cancelAll();
            }
        } catch (Throwable ignored) {}
    }

    private void updateSamsungBadge(Context context, int count) {
        try {
            PackageManager pm = context.getPackageManager();
            Intent launchIntent = pm.getLaunchIntentForPackage(context.getPackageName());
            if (launchIntent != null && launchIntent.getComponent() != null) {
                String className = launchIntent.getComponent().getClassName();
                Intent intent = new Intent("android.intent.action.BADGE_COUNT_UPDATE");
                intent.putExtra("badge_count", count);
                intent.putExtra("badge_count_package_name", context.getPackageName());
                intent.putExtra("badge_count_class_name", className);
                context.sendBroadcast(intent);
            }
        } catch (Throwable ignored) {}
    }

    @PluginMethod
    public void set(PluginCall call) {
        Integer count = call.getInt("count");
        if (count == null) {
            call.reject("count must be provided");
            return;
        }

        Context context = getContext();

        if (count <= 0) {
            // Clear notifications and badge
            cancelAllNotifications(context);
            try {
                ShortcutBadger.applyCount(context, 0);
            } catch (Throwable ignored) {}
            try {
                ShortcutBadger.removeCount(context);
            } catch (Throwable ignored) {}
            updateSamsungBadge(context, 0);
        } else {
            // Apply count
            try {
                ShortcutBadger.applyCount(context, count);
            } catch (Throwable ignored) {}
            updateSamsungBadge(context, count);

            // Ensure Android 8.0+ notification channel has badging enabled
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                try {
                    NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
                    if (notificationManager != null) {
                        NotificationChannel channel = notificationManager.getNotificationChannel("default");
                        if (channel != null && !channel.canShowBadge()) {
                            channel.setShowBadge(true);
                        }
                    }
                } catch (Throwable ignored) {}
            }
        }

        JSObject ret = new JSObject();
        ret.put("count", Math.max(0, count));
        call.resolve(ret);
    }

    @PluginMethod
    public void clear(PluginCall call) {
        Context context = getContext();

        // 1. Cancel all status bar notifications FIRST
        cancelAllNotifications(context);

        // 2. ShortcutBadger reset
        try {
            ShortcutBadger.applyCount(context, 0);
        } catch (Throwable ignored) {}
        try {
            ShortcutBadger.removeCount(context);
        } catch (Throwable ignored) {}

        // 3. Samsung direct broadcast
        updateSamsungBadge(context, 0);

        JSObject ret = new JSObject();
        ret.put("count", 0);
        call.resolve(ret);
    }

    @PluginMethod
    public void isSupported(PluginCall call) {
        try {
            boolean supported = ShortcutBadger.isBadgeCounterSupported(getContext());
            JSObject ret = new JSObject();
            ret.put("isSupported", supported);
            call.resolve(ret);
        } catch (Throwable t) {
            JSObject ret = new JSObject();
            ret.put("isSupported", true);
            call.resolve(ret);
        }
    }
}
