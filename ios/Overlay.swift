//
//  Overlay.swift
//  phoenix
//
//  Created by Steven Teague on 07/05/2021.
//

import Foundation
import UIKit

class OverlayView: UIView {
  
  var screenPositionsGuideLine:[CGPoint] = []
  var screenPositions:[CGPoint] = []
  var screenLabels:[String] = []
  var screenGuideLineLabel:String = ""
  var screenShowLoop: Bool = false
  
  var screenLooplabel: String = ""
  var phase:CGFloat = 0.0
   
  var positions:[CGPoint] = [] {
    didSet {
      screenPositions = positions
    }
  }
  
  var loopLabel:String = "" {
    didSet {
      screenLooplabel = loopLabel
    }
  }
  
  var positionsGuideLine:[CGPoint] = [] {
    didSet {
      screenPositionsGuideLine = positionsGuideLine
    }
  }
  
  var labels:[String] = [] {
    didSet {
      screenLabels = labels
    }
  }
  
  var guideLinelabel:String = "" {
    didSet {
      screenGuideLineLabel = guideLinelabel
    }
  }
  
  var showLoop:Bool = false {
    didSet {
      screenShowLoop = showLoop
    }
  }
  
  func getAngle(centre: CGPoint, first: CGPoint, second: CGPoint) -> CGFloat {
    let angle1 = atan2(first.y - centre.y, first.x - centre.x)
    let angle2 = atan2(second.y - centre.y, second.x - centre.x)
    return angle1 - angle2
  }
    
  func measure(start: CGPoint, end: CGPoint) -> CGFloat {
    let d = CGPoint(x: end.x - start.x, y: end.y - start.y)
    return CGFloat(sqrt(d.x * d.x + d.y * d.y))
  }
  
  func drawPolygon(ctx: CGContext) {
    ctx.setLineJoin(CGLineJoin.miter)
    ctx.setLineCap(CGLineCap.round)
    ctx.setFillColor(UIColor.red.cgColor)
    ctx.setStrokeColor(UIColor.red.cgColor)
    ctx.setLineWidth(4.0)
    ctx.setAlpha(0.6)

    ctx.move(to: screenPositions[0])
    
    var ax: CGFloat = 0.0
    var ay: CGFloat = 0.0
    
    for i in 0..<screenPositions.count {
      ctx.addLine(to: CGPoint(x: screenPositions[i].x, y: screenPositions[i].y))
      ax = ax + screenPositions[i].x
      ay = ay + screenPositions[i].y
    }
     
    ax = ax / CGFloat(screenPositions.count)
    ay = ay / CGFloat(screenPositions.count)
    
    ctx.addLine(to: CGPoint(x: screenPositions[0].x, y: screenPositions[0].y))
    
    ctx.drawPath(using: .fill)
    let label = UILabel(frame: CGRect(x: ax - 75, y: ay - 12.5, width: 150, height: 25))
    label.layer.anchorPoint = CGPoint(x: 0.5,y: 0.5)
    label.text = screenLooplabel
    label.textAlignment = .center
    label.textColor = UIColor.black
    label.backgroundColor = UIColor.white
    label.layer.masksToBounds = true
    label.layer.cornerRadius = 12.5
    label.font = .systemFont(ofSize: 12)
    
    self.addSubview(label)
  }
  
  func addTempline(ctx: CGContext) {
    let p1 = screenPositionsGuideLine[0]
    let p2 = screenPositionsGuideLine[1]
    let l = measure(start: p1, end: p2)
    let centre = CGPoint(x: p1.x + ((p2.x - p1.x) / 2), y: p1.y + ((p2.y - p1.y) / 2))
    
    let label = UILabel(frame: CGRect(x: centre.x - 30, y: centre.y - 12.5, width: 60, height: 25))
    label.layer.anchorPoint = CGPoint(x: 0.5,y: 0.5)
    label.text = screenGuideLineLabel
    label.textAlignment = .center
    label.textColor = UIColor.white
    label.font = .systemFont(ofSize: 14)
    label.transform = CGAffineTransform(rotationAngle: getAngle(centre: p1, first: p2, second: CGPoint(x: p2.x, y: p1.y) ))
    label.backgroundColor = UIColor.red.withAlphaComponent(0.5)
    label.layer.masksToBounds = true
    label.layer.cornerRadius = 12.5
    
    var p3 = CGPoint(x: 0, y: 0)
    var p4 = CGPoint(x: 0, y: 0)
    
    if ( l < 30) {
      p3 = CGPoint(x: p1.x + 0.4 * (p2.x  - p1.x), y: p1.y + 0.4 * (p2.y  - p1.y))
      p4 = CGPoint(x: p1.x + 0.6 * (p2.x  - p1.x), y: p1.y + 0.6 * (p2.y  - p1.y))
    } else {
      let dx = (p2.x - p1.x) / l
      let dy = (p2.y - p1.y) / l

      p3 = CGPoint(x: centre.x - (30 * dx), y: centre.y - (30 * dy))
      p4 = CGPoint(x: centre.x + (30 * dx), y: centre.y + (30 * dy))
    }

    ctx.beginPath()
    
    phase -= 1.25

    ctx.setLineCap(CGLineCap.round)
    ctx.setStrokeColor(UIColor.green.cgColor)
    ctx.setLineDash(phase: phase, lengths: [16,16])
    ctx.setLineWidth(6.0)
    ctx.addLines(between: [CGPoint(x: CGFloat(p1.x), y: CGFloat(p1.y)), CGPoint(x: CGFloat(p3.x), y: CGFloat(p3.y))])
    ctx.addLines(between: [CGPoint(x: CGFloat(p4.x), y: CGFloat(p4.y)), CGPoint(x: CGFloat(p2.x), y: CGFloat(p2.y))])
    ctx.drawPath(using: .stroke)
    self.addSubview(label)
  }
  
  override func draw(_ rect: CGRect) {
    super.draw(rect)
    
    isOpaque = false
    
    if (positions.count == 0) {
      self.subviews.forEach {$0.removeFromSuperview()}
      return
    }

    if let ctx = UIGraphicsGetCurrentContext() {
      self.subviews.forEach {$0.removeFromSuperview()}
      for (index, position) in positions.enumerated() {
        if (index < positions.count - 1) {
          let p1 = position
          let p2 = positions[index + 1]
          let centre = CGPoint(x: p1.x + ((p2.x - p1.x) / 2), y: p1.y + ((p2.y - p1.y) / 2))
          
          let label = UILabel(frame: CGRect(x: centre.x - 30, y: centre.y - 12.5, width: 60, height: 25))
          label.layer.anchorPoint = CGPoint(x: 0.5,y: 0.5)
          label.text = labels[index]
          label.textAlignment = .center
          label.textColor = UIColor.black
          label.font = .systemFont(ofSize: 14)
          label.transform = CGAffineTransform(rotationAngle: getAngle(centre: p1, first: p2, second: CGPoint(x: p2.x, y: p1.y) ))
          label.backgroundColor = UIColor.white
          label.layer.masksToBounds = true
          label.layer.cornerRadius = 12.5
          
          ctx.setLineCap(CGLineCap.round)
          ctx.setStrokeColor(UIColor.white.cgColor)
          ctx.setLineWidth(8.0)
          ctx.addLines(between: [CGPoint(x: CGFloat(p1.x), y: CGFloat(p1.y)), CGPoint(x: CGFloat(p2.x), y: CGFloat(p2.y))])
          ctx.strokePath()
          self.addSubview(label)
        }
      }
      if (screenPositionsGuideLine.count == 2) {
        addTempline(ctx: ctx)
      }
      if( showLoop ) {
        drawPolygon(ctx: ctx)
      }
    }
  }
}
