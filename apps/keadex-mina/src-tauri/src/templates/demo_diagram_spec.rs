/**
Generates a demo of a diagram's specifications file.
*/
pub fn generate_demo_diagram_spec() -> String {
  String::from(
    "{
      \"uuid\": \"401d6746-2264-44ae-9780-1955823e4a7e\",
      \"elements_specs\": [
        {
          \"alias\": \"legend\",
          \"position\": {
            \"left\": 8.867841,
            \"top\": -113.585915,
            \"z_index\": 0,
            \"angle\": 0.0
          },
          \"size\": {
            \"width\": 121.0,
            \"height\": 141.0,
            \"scale_x\": 1.0,
            \"scale_y\": 1.0
          }
        },
        {
          \"alias\": \"customer\",
          \"element_type\": {
            \"Person\": \"Person\"
          },
          \"position\": {
            \"left\": 362.18835,
            \"top\": -88.51541,
            \"z_index\": 1,
            \"angle\": 0.0
          },
          \"size\": {
            \"width\": 221.0,
            \"height\": 187.0,
            \"scale_x\": 1.0,
            \"scale_y\": 1.0
          }
        },
        {
          \"alias\": \"internetBanking\",
          \"element_type\": {
            \"SoftwareSystem\": \"System\"
          },
          \"position\": {
            \"left\": 365.42465,
            \"top\": 218.29555,
            \"z_index\": 2,
            \"angle\": 0.0
          },
          \"size\": {
            \"width\": 221.0,
            \"height\": 101.0,
            \"scale_x\": 1.0,
            \"scale_y\": 1.0
          }
        },
        {
          \"alias\": \"mainframeBanking\",
          \"element_type\": {
            \"SoftwareSystem\": \"System_Ext\"
          },
          \"position\": {
            \"left\": 612.27466,
            \"top\": 435.787,
            \"z_index\": 3,
            \"angle\": 0.0
          },
          \"size\": {
            \"width\": 221.0,
            \"height\": 101.0,
            \"scale_x\": 1.0,
            \"scale_y\": 1.0
          }
        },
        {
          \"alias\": \"emailSystem\",
          \"element_type\": {
            \"SoftwareSystem\": \"System_Ext\"
          },
          \"position\": {
            \"left\": 143.40958,
            \"top\": 433.4127,
            \"z_index\": 4,
            \"angle\": 0.0
          },
          \"size\": {
            \"width\": 221.0,
            \"height\": 101.0,
            \"scale_x\": 1.0,
            \"scale_y\": 1.0
          }
        },
        {
          \"alias\": \"customer -> internetBanking\",
          \"from\": \"customer\",
          \"to\": \"internetBanking\",
          \"shapes\": [
            {
              \"shape_type\": \"DOT\",
              \"position\": {
                \"left\": 472.0113,
                \"top\": 104.1613,
                \"z_index\": 8
              },
              \"size\": {
                \"scale_x\": 1.0,
                \"scale_y\": 1.0
              }
            },
            {
              \"shape_type\": \"TRIANGLE\",
              \"position\": {
                \"left\": 470.0091052854609,
                \"top\": 213.67188471454463,
                \"z_index\": 9,
                \"angle\": 179.47796416403634
              },
              \"size\": {
                \"scale_x\": 1.0,
                \"scale_y\": 1.0
              }
            },
            {
              \"shape_type\": \"TEXT\",
              \"position\": {
                \"left\": 478.50592,
                \"top\": 155.01001000000002,
                \"z_index\": 10
              },
              \"size\": {
                \"scale_x\": 1.0,
                \"scale_y\": 1.0
              }
            },
            {
              \"shape_type\": \"LINE\",
              \"position\": {
                \"z_index\": 7
              }
            },
            {
              \"shape_type\": \"RECTANGLE\",
              \"position\": {
                \"z_index\": 6
              }
            }
          ],
          \"element_type\": {
            \"Relationship\": \"Rel\"
          }
        },
        {
          \"alias\": \"internetBanking -> mainframeBanking\",
          \"from\": \"internetBanking\",
          \"to\": \"mainframeBanking\",
          \"shapes\": [
            {
              \"shape_type\": \"DOT\",
              \"position\": {
                \"left\": 596.3608,
                \"top\": 265.5865,
                \"z_index\": 17
              },
              \"size\": {
                \"scale_x\": 1.0,
                \"scale_y\": 1.0
              }
            },
            {
              \"shape_type\": \"DOT\",
              \"position\": {
                \"left\": 724.45844,
                \"top\": 266.20135,
                \"z_index\": 13
              },
              \"size\": {
                \"scale_x\": 1.0,
                \"scale_y\": 1.0
              }
            },
            {
              \"shape_type\": \"TRIANGLE\",
              \"position\": {
                \"left\": 721.686659806137,
                \"top\": 429.0667100081559,
                \"z_index\": 14,
                \"angle\": 179.91971268086922
              },
              \"size\": {
                \"scale_x\": 1.0,
                \"scale_y\": 1.0
              }
            },
            {
              \"shape_type\": \"TEXT\",
              \"position\": {
                \"left\": 721.8895,
                \"top\": 350.87982,
                \"z_index\": 15
              },
              \"size\": {
                \"scale_x\": 1.0,
                \"scale_y\": 1.0
              }
            },
            {
              \"shape_type\": \"LINE\",
              \"position\": {
                \"z_index\": 12
              }
            },
            {
              \"shape_type\": \"RECTANGLE\",
              \"position\": {
                \"z_index\": 11
              }
            }
          ],
          \"element_type\": {
            \"Relationship\": \"Rel\"
          }
        },
        {
          \"alias\": \"internetBanking -> emailSystem\",
          \"from\": \"internetBanking\",
          \"to\": \"emailSystem\",
          \"shapes\": [
            {
              \"shape_type\": \"DOT\",
              \"position\": {
                \"left\": 363.0,
                \"top\": 265.0,
                \"z_index\": 21
              },
              \"size\": {
                \"scale_x\": 1.0,
                \"scale_y\": 1.0
              }
            },
            {
              \"shape_type\": \"DOT\",
              \"position\": {
                \"left\": 252.5704,
                \"top\": 265.22736,
                \"z_index\": 24
              },
              \"size\": {
                \"scale_x\": 1.0,
                \"scale_y\": 1.0
              }
            },
            {
              \"shape_type\": \"TRIANGLE\",
              \"position\": {
                \"left\": 250.1699552201875,
                \"top\": 428.9840926297799,
                \"z_index\": 22,
                \"angle\": 179.79022645568438
              },
              \"size\": {
                \"scale_x\": 1.0,
                \"scale_y\": 1.0
              }
            },
            {
              \"shape_type\": \"TEXT\",
              \"position\": {
                \"left\": 254.5,
                \"top\": 352.0,
                \"z_index\": 23
              },
              \"size\": {
                \"scale_x\": 1.0,
                \"scale_y\": 1.0
              }
            },
            {
              \"shape_type\": \"LINE\",
              \"position\": {
                \"z_index\": 20
              }
            },
            {
              \"shape_type\": \"RECTANGLE\",
              \"position\": {
                \"z_index\": 19
              }
            }
          ],
          \"element_type\": {
            \"Relationship\": \"Rel\"
          }
        }
      ],
      \"shapes\": []
    }",
  )
}
