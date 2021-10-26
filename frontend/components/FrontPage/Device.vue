<template>
  <div class="device device-iphone-x">
    <div class="device-frame">
      <div
        class="bg-gradient-to-tr from-green-600 to-cyan-600 h-full"
        style="border-radius: 50px 50px 0 0"
      >
        <FrontPageShoppingList
          class="pt-14"
          :duration="1"
          :hidePurchased="true"
          :items="items"
        />
      </div>
    </div>
    <div class="device-stripe"></div>
    <div class="device-header"></div>
    <div class="device-sensors"></div>
    <div class="device-btns"></div>
    <div class="device-power"></div>
  </div>
</template>

<script>
export default {
  props: {
    items: Array,
    shop: String
  }
};
</script>
<style lang="scss" scoped>
// iPhone X
/*! Devices.css v0.1.16 | MIT License | github.com/picturepan2/devices.css */
.device,
.device *,
.device ::after,
.device ::before,
.device::after,
.device::before {
  display: block;
}

.device {
  position: relative;
  z-index: 1;
  // margin-bottom: calc((0.75 - 1) * 868px);
  // margin-right: calc((0.75 - 1) * 428px);
  // margin-left: -25px;
}
.device .device-frame {
  z-index: 1;
}
.device .device-content {
  background-color: #fff;
  background-position: center center;
  background-size: cover;
  object-fit: cover;
  position: relative;
}
.device-iphone-x {
  height: 428px;
  width: 388px;
}
.device-iphone-x .device-frame {
  background: #222;
  border-radius: 68px 68px 0 0;
  box-shadow: inset 0 2px 2px 2px #c8cacb;
  border-top: 3px solid #e2e3e4;
  border-right: 3px solid #e2e3e4;
  border-left: 3px solid #e2e3e4;
  height: 428px;
  padding: 28px 18px 0px;
  width: 388;
}
.device-iphone-x .device-content {
  border-radius: 40px;
  height: 812px;
  width: 375px;
}
.device-iphone-x .device-stripe::after,
.device-iphone-x .device-stripe::before {
  border: solid rgba(51, 51, 51, 0.25);
  border-width: 0 7px;
  content: "";
  height: 7px;
  left: 0;
  position: absolute;
  width: 100%;
  z-index: 9;
}
.device-iphone-x .device-stripe::after {
  top: 85px;
}
.device-iphone-x .device-stripe::before {
  bottom: 85px;
}
.device-iphone-x .device-header {
  background: #222;
  border-bottom-left-radius: 20px;
  border-bottom-right-radius: 20px;
  height: 30px;
  left: 50%;
  margin-left: -102px;
  position: absolute;
  top: 28px;
  width: 204px;
}
.device-iphone-x .device-header::after,
.device-iphone-x .device-header::before {
  content: "";
  height: 10px;
  position: absolute;
  top: 0;
  width: 10px;
}
.device-iphone-x .device-header::after {
  background: radial-gradient(
    circle at bottom left,
    transparent 0,
    transparent 75%,
    #222 75%,
    #222 100%
  );
  left: -10px;
}
.device-iphone-x .device-header::before {
  background: radial-gradient(
    circle at bottom right,
    transparent 0,
    transparent 75%,
    #222 75%,
    #222 100%
  );
  right: -10px;
}
.device-iphone-x .device-sensors::after,
.device-iphone-x .device-sensors::before {
  content: "";
  position: absolute;
}
.device-iphone-x .device-sensors::after {
  background: #444;
  border-radius: 3px;
  height: 6px;
  left: 50%;
  margin-left: -25px;
  top: 32px;
  width: 50px;
}
.device-iphone-x .device-sensors::before {
  background: #444;
  border-radius: 50%;
  height: 14px;
  left: 50%;
  margin-left: 40px;
  top: 28px;
  width: 14px;
}
.device-iphone-x .device-btns {
  background: #c8cacb;
  height: 32px;
  left: -3px;
  position: absolute;
  top: 115px;
  width: 3px;
}
.device-iphone-x .device-btns::after,
.device-iphone-x .device-btns::before {
  background: #c8cacb;
  content: "";
  height: 62px;
  left: 0;
  position: absolute;
  width: 3px;
}
.device-iphone-x .device-btns::after {
  top: 60px;
}
.device-iphone-x .device-btns::before {
  top: 140px;
}
.device-iphone-x .device-power {
  background: #c8cacb;
  height: 100px;
  position: absolute;
  right: -3px;
  top: 200px;
  width: 3px;
}
.device-macbook-pro {
  height: 444px;
  width: 740px;
}
.device-macbook-pro .device-frame {
  background: #0d0d0d;
  border-radius: 20px;
  box-shadow: inset 0 0 0 2px #c8cacb;
  height: 428px;
  margin: 0 auto;
  padding: 29px 19px 39px 19px;
  position: relative;
  width: 614px;
}
.device-macbook-pro .device-frame::after {
  background: #272626;
  border-radius: 0 0 20px 20px;
  bottom: 2px;
  content: "";
  height: 26px;
  left: 2px;
  position: absolute;
  width: 610px;
}
.device-macbook-pro .device-frame::before {
  bottom: 10px;
  color: #c8cacb;
  content: "MacBook Pro";
  font-size: 12px;
  height: 16px;
  left: 50%;
  line-height: 16px;
  margin-left: -100px;
  position: absolute;
  text-align: center;
  width: 200px;
  z-index: 1;
}
.device-macbook-pro .device-content {
  border: 2px solid #121212;
  border-radius: 2px;
  height: 360px;
  width: 576px;
}
.device-macbook-pro .device-power {
  background: #e2e3e4;
  border: solid #d5d6d8;
  border-radius: 2px 2px 0 0;
  border-width: 2px 4px 0 4px;
  height: 14px;
  margin-top: -10px;
  position: relative;
  width: 740px;
  z-index: 9;
}
.device-macbook-pro .device-power::after,
.device-macbook-pro .device-power::before {
  content: "";
  position: absolute;
}
.device-macbook-pro .device-power::after {
  background: #d5d6d8;
  border-radius: 0 0 10px 10px;
  box-shadow: inset 0 0 4px 2px #babdbf;
  height: 10px;
  left: 50%;
  margin-left: -60px;
  top: -2px;
  width: 120px;
}
.device-macbook-pro .device-power::before {
  background: #a0a3a7;
  border-radius: 0 0 180px 180px/0 0 12px 12px;
  box-shadow: inset 0 -2px 6px 0 #474a4d;
  height: 12px;
  left: -4px;
  margin: 0 auto;
  top: 10px;
  width: 740px;
}
.device-macbook-pro.device-spacegray .device-frame {
  box-shadow: inset 0 0 0 2px #767a7d;
}
.device-macbook-pro.device-spacegray .device-power {
  background: #909496;
  border-color: #767a7d;
}
.device-macbook-pro.device-spacegray .device-power::after {
  background: #83878a;
  box-shadow: inset 0 0 4px 2px #6a6d70;
}
.device-macbook-pro.device-spacegray .device-power::before {
  background: #515456;
  box-shadow: inset 0 -2px 6px 0 #000;
}
</style>
