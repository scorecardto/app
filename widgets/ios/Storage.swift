import CommonCrypto
import Foundation

private let directory = FileManager.default.containerURL(forSecurityApplicationGroupIdentifier: "group.com.scorecardgrades.mobile.expowidgets")!.appendingPathComponent("Storage", isDirectory: true);

public func getItem(_ key: String) -> Data? {
  do {
      return try encryption(Data(contentsOf: directory.appendingPathComponent(key, isDirectory: false)), operation: kCCDecrypt)
  } catch {
      return nil
  }
}

public func storeItem(_ key: String, _ item: Data) throws {
  do {
      try FileManager.default.createDirectory(at: directory, withIntermediateDirectories: false)
  } catch {} // likely already exists
  try encryption(item, operation: kCCEncrypt).write(to: directory.appendingPathComponent(key, isDirectory: false))
}

public func clearStorage() throws {
  try FileManager.default.contentsOfDirectory(at: directory, includingPropertiesForKeys: nil).forEach({u in try FileManager.default.removeItem(at: u)})
}

private func encryption(_ data: Data, operation: Int) -> Data {
    let cryptLength = data.count + kCCBlockSizeAES128
    var cryptData = Data(count:cryptLength)

    let options = CCOptions(kCCOptionPKCS7Padding)

    let keyData = getKey()
    let key = keyData[..<16]
    let iv = keyData[16...]

    var numBytesEncrypted = 0

    let status = cryptData.withUnsafeMutableBytes {cryptBytes in
        data.withUnsafeBytes {dataBytes in
            iv.withUnsafeBytes {ivBytes in
                key.withUnsafeBytes {keyBytes in
                    CCCrypt(CCOperation(operation),
                              CCAlgorithm(kCCAlgorithmAES),
                              options,
                              keyBytes, kCCKeySizeAES128,
                              ivBytes,
                              dataBytes, data.count,
                              cryptBytes, cryptLength,
                              &numBytesEncrypted)
                }
            }
        }
    }
    cryptData.removeSubrange(numBytesEncrypted..<cryptData.count)

    return cryptData;
}

private func generateKey() -> Data {
    var keyData = Data(count: 32)
    let status = keyData.withUnsafeMutableBytes {
        (mutableBytes: UnsafeMutablePointer<UInt8>) -> Int32 in
        SecRandomCopyBytes(kSecRandomDefault, 32, mutableBytes)
    }

    return keyData;
}

private func getKey() -> Data {
    var item: CFTypeRef?

    var query: [String: Any] = getQuery()
    query[kSecMatchLimit as String] = kSecMatchLimitOne
    query[kSecReturnData as String] = kCFBooleanTrue

    String.Encoding.isoLatin1

    let status = SecItemCopyMatching(query as CFDictionary, &item)

    if (status == errSecItemNotFound) {
        let newKey = generateKey()

        query = getQuery()
        query[kSecValueData as String] = newKey
        query[kSecAttrAccessible as String] = kSecAttrAccessibleAfterFirstUnlock

        SecItemAdd(query as CFDictionary, nil)

        return newKey
    }

    return item as! Data
}

private func getQuery() -> [String: Any] {
    return [
        kSecClass as String: kSecClassGenericPassword,
        kSecAttrService as String: "scorecard",
        kSecAttrGeneric as String: "key".data(using: .utf8),
//        kSecAttrAccount as String: "key".data(using: .utf8),
        kSecAttrAccessGroup as String: "group.com.scorecardgrades.mobile.expowidgets"
    ]
}
