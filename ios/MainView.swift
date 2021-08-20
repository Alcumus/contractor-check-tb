//
//  MainView.swift
//  phoenix
//
//  Created by Steven Teague on 08/05/2021.
//

import Foundation
import React
import ARKit

struct Vector3C: Codable {
  let x: Float
  let y: Float
  let z: Float
}

class MainView: UIView {
  var callback: RCTDirectEventBlock? = nil
  var positions: [SCNVector3] = []
  
  @objc func setOnChangeSceneInfo(_ onChangeSceneInfo: @escaping RCTDirectEventBlock) {
    print("setOnChangeSceneInfo called ")
    callback = onChangeSceneInfo
  }
  
  override func draw(_ rect: CGRect) {
    super.draw(rect)
    print(" main ")
    info()
  }
}

extension MainView {
  public func info() {
    if (self.callback != nil) {
      var result:[[NSObject:AnyObject]]=[[:]]
      
      for (_, position) in positions.enumerated() {
        let vector3c = Vector3C(x: position.x, y: position.y, z: position.z)
        do {
          let encodedData = try JSONEncoder().encode(vector3c)
          let jsonString = String(data: encodedData,
                                  encoding: .utf8)
          result.append(["position" as NSObject : jsonString! as NSString])
        } catch {
          print(error)
        }
      }
      
      self.callback!(["positions" : result])
    }
  }
}
