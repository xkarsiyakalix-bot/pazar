package com.exvitrin.app;

import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.content.Context;
import android.os.Build;
import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import me.leolin.shortcutbadger.ShortcutBadger;

@CapacitorPlugin(name = "Badge")
public class BadgePlugin extends Plugin {

    @PluginMethod
    public void set(PluginCall call) {
        Integer count = call.getInt("count");
        if (count == null) {
            call.reject("count must be provided");
            return;
        }

        try {
            Context context = getContext();

            // 1. Apply count via ShortcutBadger for manufacturer launchers (Samsung, Xiaomi, Huawei, etc.)
            if (count <= 0) {
                ShortcutBadger.removeCount(context);
            } else {
                ShortcutBadger.applyCount(context, count);
            }

            // 2. Ensure Android 8.0+ notification channel has badging enabled
            if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
                NotificationManager notificationManager = (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);
                if (notificationManager != null) {
                    NotificationChannel channel = notificationManager.getNotificationChannel("default");
                    if (channel != null && !channel.canShowBadge()) {
                        channel.setShowBadge(true);
                    }
                }
            }

            JSObject ret = new JSObject();
            ret.put("count", Math.max(0, count));
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to set badge: " + e.getMessage());
        }
    }

    @PluginMethod
    public void clear(PluginCall call) {
        try {
            Context context = getContext();
            ShortcutBadger.removeCount(context);
            JSObject ret = new JSObject();
            ret.put("count", 0);
            call.resolve(ret);
        } catch (Exception e) {
            call.reject("Failed to clear badge: " + e.getMessage());
        }
    }

    @PluginMethod
    public void isSupported(PluginCall call) {
        try {
            boolean supported = ShortcutBadger.isBadgeCounterSupported(getContext());
            JSObject ret = new JSObject();
            ret.put("isSupported", supported);
            call.resolve(ret);
        } catch (Exception e) {
            JSObject ret = new JSObject();
            ret.put("isSupported", false);
            call.resolve(ret);
        }
    }
}

