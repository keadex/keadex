/*!
This module export the diagram style constants used to compute the auto layout.
These constants must match the same constants declared in the frontend layer: libs\c4-model-ui-kit\src\styles\style-constants.ts
*/

pub const LEGEND_WIDTH: f64 = 120.0;
pub const LEGEND_HEIGHT: f64 = 20.0;
pub const LEGEND_LEFT: f64 = 20.0;
pub const LEGEND_TOP: f64 = 20.0;

pub const ELEMENT_BORDER_WIDTH: f64 = 1.0;
pub const ELEMENT_DEFAULT_TOP: f64 = LEGEND_TOP;
pub const ELEMENT_DEFAULT_LEFT: f64 = LEGEND_LEFT + LEGEND_WIDTH + 50.0;

pub const BOX_WIDTH: f64 = 220.0;
pub const BOX_MIN_HEIGHT: f64 = 100.0;

pub const QUEUE_HEAD_BOX_WIDTH: f64 = 20.0;
pub const QUEUE_RADIUS_TAIL_HEAD: f64 = BOX_MIN_HEIGHT / 2.0 - ELEMENT_BORDER_WIDTH / 2.0;
pub const QUEUE_SCALE_Y_TAIL_HEAD: f64 = 0.3;
pub const QUEUE_SCALED_RADIUS_TAIL_HEAD: f64 = QUEUE_RADIUS_TAIL_HEAD * QUEUE_SCALE_Y_TAIL_HEAD;
pub const QUEUE_WIDTH_TAIL: f64 = QUEUE_SCALED_RADIUS_TAIL_HEAD;
pub const QUEUE_WIDTH_HEAD: f64 = QUEUE_HEAD_BOX_WIDTH + QUEUE_SCALED_RADIUS_TAIL_HEAD;

pub const DB_TOP_BOX_HEIGHT: f64 = 14.0;
pub const DB_RADIUS_TOP_BOTTOM: f64 = BOX_WIDTH / 2.0 - ELEMENT_BORDER_WIDTH / 2.0;
pub const DB_SCALE_X_TOP_BOTTOM: f64 = 0.15;
pub const DB_SCALED_RADIUS_TOP_BOTTOM: f64 = DB_RADIUS_TOP_BOTTOM * DB_SCALE_X_TOP_BOTTOM;
pub const DB_WIDTH_TOP: f64 = DB_TOP_BOX_HEIGHT + DB_SCALED_RADIUS_TOP_BOTTOM;
pub const DB_WIDTH_BOTTOM: f64 = DB_SCALED_RADIUS_TOP_BOTTOM;

pub const PERSON_HEAD_RADIUS: f64 = 45.0;

pub const BASE_ELASTIC_CONTAINER_MIN_WIDTH: f64 = 150.0;
pub const BASE_ELASTIC_CONTAINER_MIN_HEIGHT: f64 = 80.0;

pub const BASE_ELASTIC_CONTAINER_PADDING_FOOTER: f64 = 10.0;
pub const BASE_ELASTIC_CONTAINER_PADDING_BOX: f64 = 10.0;
// The footer height is based on the font size, line height and font height. The font height
// is calculated by Fabric.js so it is not possible to recalculate it here. The only option for now
// it to hardcode the following size, which is taken directly from Fabric.js.
// This is not the best solution but for now "it just works".
pub const BASE_ELASTIC_CONTAINER_FOOTER_HEIGHT: f64 = 23.6;
