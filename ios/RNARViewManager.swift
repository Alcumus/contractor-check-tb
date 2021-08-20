//
//  RNARManager.swift
//  phoenix
//
//  Created by Steven Teague on 30/04/2021.
//

import Foundation
import React
import UIKit

@available(iOS 11.0, *)
@objc (RNARViewManager)
open class RNARViewManager: RCTViewManager {
  var AR: RNARViewController = RNARViewController()

  public override init() {
    super.init()
  }
  override open func view() -> UIView {
    return AR.mainView
  }
  override public static func requiresMainQueueSetup() -> Bool {
    return true
  }
  @objc func addPoint(_ flag: String) {
    DispatchQueue.main.async {
      self.AR.addPoint()
    }
  }
  @objc func clear(_ flag: String) {
    DispatchQueue.main.async {
      self.AR.clear()
    }
  }
  @objc func startAR(_ flag: String) {
    DispatchQueue.main.async {
      self.AR.startAR()
    }
  }
  @objc func closeLoop(_ flag: String) {
    DispatchQueue.main.async {
      self.AR.closeLoop()
    }
  }
  @objc func guideline(_ flag: String) {
    DispatchQueue.main.async {
      self.AR.guideline()
    }
  }
}

//  @objc func setOnChangeSceneInfo(_ onChangeSceneInfo: @escaping RCTDirectEventBlock) {
//    callback = onChangeSceneInfo
//  }

//extension RNARViewManager {
//  public func info() {
//    DispatchQueue.main.async {
//      if (self.callback != nil) {
//        //          self.AR.guideline()
//        let result:[NSObject:AnyObject]=[
//          "area" as NSObject: "Boooo" as AnyObject
//        ]
//        self.callback!(result)
//      }
//    }
//  }
//}
