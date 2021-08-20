//
//  ARViewController.swift
//  phoenix
//
//  Created by Steven Teague on 30/04/2021.
//

import Foundation
import UIKit
import SceneKit
import ARKit
import React

@objc (RNARViewController)
class RNARViewController: UIViewController, ARSCNViewDelegate, ARSessionDelegate {
  
  var positions:[SCNVector3] = []
  var labels:[String] = []
  var sceneView: ARSCNView = ARSCNView()
  var overlay: OverlayView = OverlayView()
  var camera: SCNVector3 = SCNVector3()
  var showGuide: Bool = true
  var showLoop: Bool = false
  var mainView: MainView = MainView()
  
  required public init() {
    super.init(nibName: nil, bundle: nil)
    
    // Todo Fix this
    view.backgroundColor = .white
    mainView.addSubview(self.sceneView)
    mainView.backgroundColor = .lightGray
  }
  
  required init?(coder: NSCoder) {
    super.init(nibName: nil, bundle: nil)
  }
  
  
  override func viewDidLoad() {
    super.viewDidLoad()

    mainView.translatesAutoresizingMaskIntoConstraints = false
    view.addSubview(mainView)
    mainView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        
    sceneView.translatesAutoresizingMaskIntoConstraints = false
    mainView.addSubview(sceneView)
    sceneView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    
    overlay.translatesAutoresizingMaskIntoConstraints = false
    sceneView.addSubview(overlay)
    overlay.autoresizingMask = [.flexibleWidth, .flexibleHeight]
    
    sceneView.bringSubviewToFront(overlay)
  
    sceneView.delegate = self
    sceneView.session.delegate = self
    sceneView.preferredFramesPerSecond = 30

    sceneView.debugOptions = [ARSCNDebugOptions.showFeaturePoints, ARSCNDebugOptions.showCreases]
    let configuration = ARWorldTrackingConfiguration()
    configuration.planeDetection = [.horizontal, .vertical]
//    configuration.isAutoFocusEnabled = true
    
    sceneView.session.run(configuration, options: [.resetTracking,.removeExistingAnchors])
    sceneView.isUserInteractionEnabled = true
  }
  
  override func viewWillDisappear(_ animated: Bool) {
    super.viewWillDisappear(animated)
    sceneView.session.pause()
  }
  
  override func touchesBegan(_ touches: Set<UITouch>, with event: UIEvent?) {
    // set the frame to the full screen
  }
  
  func createObject(position: SCNVector3) {}
  
  func measure(start: SCNVector3, end: SCNVector3) -> CGFloat {
    let d = SCNVector3(x: end.x - start.x, y: end.y - start.y, z: end.z - start.z)
    return CGFloat(sqrt(d.x * d.x + d.y * d.y + d.z * d.z))
  }
  
  func getArea() -> Float {
    var ax:Float = 0.0
    var ay:Float = 0.0
    var az:Float = 0.0
    var area: Float = 0.0
    
    if (positions.count == 3) {
      let a: Float = Float(measure(start: positions[0], end: positions[1]))
      let b: Float = Float(measure(start: positions[1], end: positions[2]))
      let c: Float = Float(measure(start: positions[0], end: positions[2]))
      
      let s = Float(((a+b+c) * 0.5))
      return sqrt(s * ((s-a) * (s-b) * (s-c)))
      
    } else if (positions.count > 3) {
      for (_, position) in positions.enumerated() {
        ax = Float(ax + position.x)
        ay = Float(ay + position.y)
        az = Float(az + position.z)
      }
      ax = ax / Float(positions.count)
      ay = ay / Float(positions.count)
      az = az / Float(positions.count)
      
      for i in 0..<positions.count - 1 {
        let a: Float = Float(measure(start: SCNVector3Make(Float(ax), Float(ay), Float(az)), end: positions[i]))
        let b: Float = Float(measure(start: SCNVector3Make(Float(ax), Float(ay), Float(az)), end: positions[i+1]))
        let c: Float = Float(measure(start: positions[i], end: positions[i+1]))
        
        let s = Float(((a+b+c) * 0.5))
        area = area + sqrt(s * ((s-a) * (s-b) * (s-c)))
      }
      
      let a: Float = Float(measure(start: SCNVector3Make(Float(ax), Float(ay), Float(az)), end: positions[positions.count - 1]))
      let b: Float = Float(measure(start: SCNVector3Make(Float(ax), Float(ay), Float(az)), end: positions[0]))
      let c: Float = Float(measure(start: positions[0], end: positions[positions.count - 1]))
      
      let s = Float(((a+b+c) * 0.5))
      area = area + sqrt(s * ((s-a) * (s-b) * (s-c)))
      
    }
    return Float(area)
  }
  
  func session(_ session: ARSession, didUpdate frame: ARFrame) {
    camera = SCNVector3(x: frame.camera.transform[0][3], y: frame.camera.transform[1][3], z: frame.camera.transform[2][3])
    
    let centre = sceneView.center
    let hitTests = sceneView.hitTest(centre,types: [ARHitTestResult.ResultType.featurePoint])
    
    guard let position = hitTests.last else {return}
    let hitTransform = SCNMatrix4.init(position.worldTransform)
    let hitVector = SCNVector3Make(hitTransform.m41, hitTransform.m42, hitTransform.m43)
    
    if (positions.count > 0 && showGuide == true) {
      overlay.screenPositionsGuideLine.removeAll()
      let p1 = sceneView.projectPoint(positions[positions.count-1])
      let p2 = sceneView.projectPoint(hitVector)
      
      overlay.screenPositionsGuideLine.append(CGPoint(x: CGFloat(p1.x), y: CGFloat(p1.y)))
      overlay.screenPositionsGuideLine.append(CGPoint(x: CGFloat(p2.x), y: CGFloat(p2.y)))
      
      let length = measure(start: hitVector, end: positions[positions.count-1])
      overlay.screenGuideLineLabel = String(format: "%0.2f", length)
      
      if (length >= 1.0) {
        overlay.screenGuideLineLabel = String(format: "%0.1f m", length)
      } else {
        overlay.screenGuideLineLabel = String(format: "%0.0f cm", round(length * 100))
      }
      
    } else {
      overlay.screenPositionsGuideLine.removeAll()
    }
    updateMeasures()
  }
  
  func sessionWasInterrupted(_ session: ARSession) {}
  
  func sessionInterruptionEnded(_ session: ARSession) {}
  
  func updateMeasures () {
    var screenSpacePositions:[CGPoint] = []
    for (_, position) in positions.enumerated() {
      let p = sceneView.projectPoint(position)
      screenSpacePositions.append(CGPoint(x: CGFloat(p.x), y: CGFloat(p.y)))
    }
    
    overlay.loopLabel = ""
    
    if (positions.count > 2) {
      let area = getArea()
      if (area >= 1.0) {
        overlay.loopLabel = String(format: "%0.2f metres squared", area)
      } else {
        overlay.loopLabel = String(format: "%0.0f centimetres squared", round(area * 10000))
      }
    }
    
    overlay.labels = labels
    overlay.positions = screenSpacePositions
//    overlay.frame = sceneView.frame
//    mainView.setNeedsDisplay()
//    mainView.frame = view.frame
//    sceneView.frame = view.frame
//    overlay.frame = view.frame
//    print( " mainView.frame ", mainView.frame )
//    print( " sceneView.frame ", sceneView.frame )
//    print( " view.frame ", view.frame )
//    print( " view.bounds ", view.bounds )
    overlay.setNeedsDisplay()
  }
  
  func addPoint() {
    let tap = sceneView.center
    let hitTests = sceneView.hitTest(tap,types: [ARHitTestResult.ResultType.featurePoint])
    
    guard let position = hitTests.last else {return}
    let hitTransform = SCNMatrix4.init(position.worldTransform)
    let hitVector = SCNVector3Make(hitTransform.m41, hitTransform.m42, hitTransform.m43)
    
    if (positions.count > 0) {
      let length = measure(start: hitVector, end: positions[positions.count-1])
      if (length >= 1.0) {
        labels.append(String(format: "%0.1f m", length))
      } else {
        labels.append(String(format: "%0.0f cm", round(length * 100)))
      }
    }

    positions.append(hitVector)
    mainView.positions = positions
    mainView.info()
  }
  
  func clear() {
    overlay.showLoop = false
    overlay.loopLabel = ""
    labels.removeAll()
    positions.removeAll()
    sceneView.scene.rootNode.enumerateChildNodes{ (node, stop) in node.removeFromParentNode()}
  }
  
  func startAR () {
    sceneView.debugOptions = [ARSCNDebugOptions.showFeaturePoints, ARSCNDebugOptions.showWorldOrigin]
    let configuration = ARWorldTrackingConfiguration()
    sceneView.session.run(configuration)
  }
  
  func closeLoop() {
    overlay.showLoop = !overlay.showLoop
  }
  
  func guideline() {
    showGuide = !showGuide
  }
  
  override func didReceiveMemoryWarning() {}
}
