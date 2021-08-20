//
//  RNARView.m
//  phoenix
//
//  Created by Steven Teague on 30/04/2021.
//

#import <React/RCTViewManager.h>
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(RNARViewManager, RCTViewManager)

RCT_EXTERN_METHOD(addPoint: (NSString*)flag);
RCT_EXTERN_METHOD(clear: (NSString*)flag);
RCT_EXTERN_METHOD(startAR: (NSString*)flag);
RCT_EXTERN_METHOD(closeLoop: (NSString*)flag);
RCT_EXTERN_METHOD(guideline: (NSString*)flag);

RCT_EXPORT_VIEW_PROPERTY(onChangeSceneInfo, RCTDirectEventBlock);

@end
