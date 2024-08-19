package com.scorecardgrades.mobile

import java.io.File;
import java.io.FileNotFoundException;
import java.util.Arrays;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import java.security.KeyStore;
import javax.crypto.Cipher;
import javax.crypto.spec.IvParameterSpec;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;
import android.content.Context

private const val TRANSFORMATION =
    "${KeyProperties.KEY_ALGORITHM_AES}/${KeyProperties.BLOCK_MODE_CBC}/${KeyProperties.ENCRYPTION_PADDING_PKCS7}";
private val ANDROID_KEY_STORE = "AndroidKeyStore"

public fun getItem(dir: File, key: String): String? {
    try {
        val bytes = File(dir, key).readBytes();

        val cipher = Cipher.getInstance(TRANSFORMATION);
        cipher.init(Cipher.DECRYPT_MODE, getKey(), IvParameterSpec(bytes.sliceArray(0..15)));

        return cipher.doFinal(bytes.sliceArray(16..bytes.size-1)).decodeToString();
    } catch (e: FileNotFoundException) {
        return null;
    }
}

public fun storeItem(dir: File, key: String, value: String) {
    val cipher = Cipher.getInstance(TRANSFORMATION);
    cipher.init(Cipher.ENCRYPT_MODE, getKey());

    val iv = cipher.getIV();
    val encrypted = cipher.doFinal(value.toByteArray());

    File(dir, key).writeBytes(iv + encrypted);
}

private fun getKey(): SecretKey {
    val keyStore = KeyStore.getInstance(ANDROID_KEY_STORE).run { load(null); this; };

    return (keyStore.getEntry("storage", null) as? KeyStore.SecretKeyEntry)?.getSecretKey() ?: generateKey()
}

private fun generateKey(): SecretKey {
    val keyGenerator = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, ANDROID_KEY_STORE)
    keyGenerator.init(KeyGenParameterSpec.Builder(
        "storage", KeyProperties.PURPOSE_ENCRYPT or KeyProperties.PURPOSE_DECRYPT)
        .setBlockModes(KeyProperties.BLOCK_MODE_CBC)
        .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_PKCS7)
        .setKeySize(128)
        .build())

    return keyGenerator.generateKey();
}

public fun clearStorage(dir: File) {
    dir.listFiles().forEach { it.delete() }
}