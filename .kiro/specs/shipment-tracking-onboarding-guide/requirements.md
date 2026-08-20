# Requirements Document

## Introduction

Shipment Tracking Onboarding Guide 是 International 模块下 Shipment Tracking 页面的新功能引导系统。当客户首次访问列表页面时，系统通过轮播对话框和分步蒙层引导两种交互方式，向客户介绍新上线的功能和页面布局，帮助客户快速熟悉 Shipment Tracking 列表页和详情页的核心功能区域。

## Glossary

- **Onboarding_Dialog**: 新功能上线引导对话框，以轮播图形式展示功能介绍和页面缩略图
- **Guided_Tour**: 分步蒙层引导，使用蒙层、高亮框选区域和曲线箭头指向功能入口
- **Tour_Step**: Guided Tour 中的单个引导步骤，包含高亮区域、曲线箭头和文案提示
- **Carousel_Slide**: Onboarding Dialog 中的单张轮播内容，包含功能介绍文案和缩略图
- **Overlay_Mask**: 蒙层，覆盖页面其他区域使目标区域突出显示
- **Highlight_Region**: 框选区域，在蒙层中露出的目标功能区域
- **Curved_Arrow**: 曲线箭头，从提示文案指向高亮区域的视觉引导元素
- **Tooltip**: 文案提示框，包含对目标区域的简短功能描述
- **First_Visit_Flag**: 首次访问标记，存储在本地存储中用于判断是否需要展示引导
- **List_Page**: Shipment Tracking 列表页面，路由为 `/international-new/tracking`
- **Detail_Page**: Shipment Tracking 详情页面，路由为 `/international/tracking2/:id`
- **Overview_Tab**: 详情页 Overview 页签，包含 Info、Progress、Timeline、Shipment Journey Map
- **System**: 指 Shipment Tracking Onboarding Guide 系统整体

## Requirements

### Requirement 1: First Visit Detection

**User Story:** As a customer, I want the onboarding guide to appear only on my first visit to the Shipment Tracking list page, so that I am not repeatedly interrupted by introductory content.

#### Acceptance Criteria

1. WHEN a customer navigates to the List_Page and the First_Visit_Flag does not exist in browser localStorage, THE System SHALL display the Onboarding_Dialog after the List_Page content has finished rendering
2. WHEN the Onboarding_Dialog is displayed, THE System SHALL store the First_Visit_Flag in browser localStorage before the customer interacts with the dialog
3. WHILE the First_Visit_Flag exists in localStorage, THE System SHALL skip displaying the Onboarding_Dialog on subsequent visits
4. IF localStorage is unavailable, THEN THE System SHALL skip displaying the Onboarding_Dialog and allow normal page access
5. IF the customer navigates away from the List_Page before the Onboarding_Dialog is displayed, THEN THE System SHALL not store the First_Visit_Flag and SHALL display the Onboarding_Dialog on the next visit

### Requirement 2: Onboarding Dialog Carousel Display

**User Story:** As a customer, I want to view new feature introductions in a carousel-style dialog, so that I can understand all new capabilities at my own pace.

#### Acceptance Criteria

1. WHEN the Onboarding_Dialog is displayed, THE System SHALL render a modal dialog centered on the viewport with a backdrop of opacity between 0.4 and 0.6 that prevents interaction with the underlying page
2. THE Onboarding_Dialog SHALL contain left and right arrow navigation buttons for switching between Carousel_Slides
3. WHEN the customer clicks the right arrow on the last Carousel_Slide, THE System SHALL disable the right arrow button
4. WHEN the customer clicks the left arrow on the first Carousel_Slide, THE System SHALL disable the left arrow button
5. THE Onboarding_Dialog SHALL display a slide indicator in the format "current / total" (e.g., "1 / 3") showing the current slide position relative to total slides
6. THE Onboarding_Dialog SHALL contain a "Got it" (我知道了) button that closes the dialog
7. WHEN the Onboarding_Dialog is first displayed, THE System SHALL show the first Carousel_Slide with the left arrow button disabled and the right arrow button enabled
8. WHEN the customer clicks the right arrow button on a non-last Carousel_Slide, THE System SHALL advance to the next Carousel_Slide and update the slide indicator accordingly

### Requirement 3: Carousel Content - List Page Features

**User Story:** As a customer, I want to see introductions of the list page features in the carousel, so that I understand the available search, filter, and alert capabilities.

#### Acceptance Criteria

1. THE Onboarding_Dialog SHALL include an overview Carousel_Slide for the List_Page that displays a thumbnail screenshot of the full list page and a text summary listing the features: Quick Search, Recent Searches, Risk Alert Cards, Status Tabs, and Shipment Table
2. THE Onboarding_Dialog SHALL include a dedicated Carousel_Slide for the Quick Search functionality that displays a thumbnail highlighting the search bar area and a text description of the search capability
3. THE Onboarding_Dialog SHALL include a dedicated Carousel_Slide for the Recent Searches functionality that displays a thumbnail highlighting the recent searches area and a text description of the recent searches capability
4. THE Onboarding_Dialog SHALL include a dedicated Carousel_Slide for the Risk Alert Cards that displays a thumbnail highlighting the alert cards area and a text description covering Customs Hold, Approaching LFD, LFD Exceeded, and Warehouse Receiving categories
5. THE Onboarding_Dialog SHALL include a dedicated Carousel_Slide for the Status Tab switching functionality that displays a thumbnail highlighting the status tabs area and a text description of the tab filtering capability
6. THE Onboarding_Dialog SHALL include a dedicated Carousel_Slide for the Shipment Table that displays a thumbnail highlighting the table area and a text description of the shipment information display
7. THE List_Page Carousel_Slides SHALL appear in the Onboarding_Dialog in the following order: List_Page overview, Quick Search, Recent Searches, Risk Alert Cards, Status Tabs, Shipment Table, followed by Detail_Page slides

### Requirement 4: Carousel Content - Detail Page Features

**User Story:** As a customer, I want to see introductions of the detail page features in the carousel, so that I understand the tracking detail capabilities before exploring them.

#### Acceptance Criteria

1. THE Onboarding_Dialog SHALL include a Carousel_Slide for the Overview_Tab displaying a title, descriptive text, and a thumbnail image depicting the Info panel, Progress bar, Business Milestone Timeline, and Shipment Journey Map (with a route path example shown on the map)
2. THE Onboarding_Dialog SHALL include a Carousel_Slide for the Containers & Drayage tab displaying a title, descriptive text, and a thumbnail image depicting the tab's content layout
3. THE Onboarding_Dialog SHALL include a Carousel_Slide for the Items SKUs tab displaying a title, descriptive text, and a thumbnail image depicting the tab's content layout
4. THE Onboarding_Dialog SHALL include a Carousel_Slide for the Customs Clearance tab displaying a title, descriptive text, and a thumbnail image depicting the tab's content layout
5. THE Onboarding_Dialog SHALL include a Carousel_Slide for the Drayage Load tab displaying a title, descriptive text, a thumbnail image depicting the tab's content layout, and text stating that clicking Load # navigates to the load detail page
6. THE Onboarding_Dialog SHALL present the Detail_Page Carousel_Slides in the following fixed order: Overview_Tab, Containers & Drayage, Items SKUs, Customs Clearance, Drayage Load

### Requirement 5: Dialog Dismissal and Tour Trigger

**User Story:** As a customer, I want to close the onboarding dialog and immediately begin the guided tour on the list page, so that I can learn features in context.

#### Acceptance Criteria

1. WHEN the customer clicks the "Got it" button in the Onboarding_Dialog, THE System SHALL close the Onboarding_Dialog within 500ms
2. WHEN the Onboarding_Dialog is closed via the "Got it" button, THE System SHALL start the Guided_Tour on the List_Page within 500ms of dialog closure
3. WHEN the customer clicks the backdrop area outside the Onboarding_Dialog, THE System SHALL close the dialog without starting the Guided_Tour
4. WHEN the customer presses the Escape key while the Onboarding_Dialog is displayed, THE System SHALL close the dialog without starting the Guided_Tour

### Requirement 6: List Page Guided Tour

**User Story:** As a customer, I want a step-by-step guided tour on the list page highlighting each feature area, so that I can locate and understand each function in its actual position.

#### Acceptance Criteria

1. WHEN the List_Page Guided_Tour starts, THE System SHALL display an Overlay_Mask covering the entire page except the current Highlight_Region
2. THE List_Page Guided_Tour SHALL include 5 sequential Tour_Steps in the following fixed order: Quick Search bar, Recent Searches area, Risk Alert Cards, Status Tabs, and Shipment Table
3. WHEN a Tour_Step is active, THE System SHALL display a Highlight_Region around the target feature area with a border visually distinguishing it from the masked area
4. WHEN a Tour_Step is active, THE System SHALL display a Curved_Arrow pointing from the Tooltip to the Highlight_Region
5. WHEN a Tour_Step is active, THE System SHALL display a Tooltip containing a description of the highlighted feature limited to 1-2 sentences
6. WHEN the customer clicks the "Next" button on a Tour_Step, THE System SHALL transition to the next Tour_Step with updated Highlight_Region, Curved_Arrow, and Tooltip
7. WHEN the customer completes the last Tour_Step on the List_Page, THE System SHALL remove the Overlay_Mask and end the List_Page Guided_Tour
8. WHEN the customer clicks the "Skip" button during any Tour_Step, THE System SHALL remove the Overlay_Mask and end the List_Page Guided_Tour immediately
9. IF a target element for a Tour_Step is not visible on the page, THEN THE System SHALL skip that Tour_Step and proceed to the next Tour_Step in sequence

### Requirement 7: Detail Page Guided Tour - Overview Tab

**User Story:** As a customer, I want a guided tour on the detail page Overview tab highlighting new feature areas, so that I can understand the tracking detail layout.

#### Acceptance Criteria

1. WHEN the customer navigates to the Detail_Page for the first time after completing the List_Page Guided_Tour, THE System SHALL start the Overview_Tab Guided_Tour
2. THE Overview_Tab Guided_Tour SHALL include exactly 4 sequential Tour_Steps in the following order: Info panel, Progress bar, Business Milestone Timeline, and Shipment Journey Map
3. WHEN a Tour_Step is active on the Overview_Tab, THE System SHALL display an Overlay_Mask, Highlight_Region, Curved_Arrow, and Tooltip for the target area
4. WHEN the customer clicks "Next" on a Tour_Step, THE System SHALL transition to the next Tour_Step in sequence
5. WHEN the customer completes the last Overview_Tab Tour_Step (Shipment Journey Map), THE System SHALL automatically transition to the Tab Navigation Guided Tour
6. IF the customer navigates away from the Detail_Page before completing the Overview_Tab Guided_Tour, THEN THE System SHALL end the tour and resume from the first Tour_Step on the next Detail_Page visit

### Requirement 8: Detail Page Guided Tour - Tab Navigation

**User Story:** As a customer, I want the guided tour to point out the remaining detail tabs, so that I know where to find Containers, Items, Customs, and Drayage information.

#### Acceptance Criteria

1. WHEN the Overview_Tab Guided_Tour completes, THE System SHALL display an Overlay_Mask highlighting the Containers & Drayage tab with a Curved_Arrow and Tooltip
2. WHEN the customer clicks "Next" after viewing the Containers & Drayage tab highlight, THE System SHALL highlight the Items SKUs tab with a Curved_Arrow and Tooltip
3. WHEN the customer clicks "Next" after viewing the Items SKUs tab highlight, THE System SHALL highlight the Customs Clearance tab with a Curved_Arrow and Tooltip
4. WHEN the customer clicks "Next" after viewing the Customs Clearance tab highlight, THE System SHALL highlight the Drayage Load tab with a Curved_Arrow and Tooltip
5. WHEN the customer completes the last tab highlight (Drayage Load), THE System SHALL remove the Overlay_Mask and end the Detail_Page Guided_Tour
6. THE Drayage Load tab Tooltip SHALL mention that clicking Load # navigates to the corresponding load detail page
7. IF the customer navigates away from the Detail_Page before completing the Tab Navigation Guided Tour, THEN THE System SHALL end the tour and resume from the first tab highlight on the next Detail_Page visit

### Requirement 9: Tour Step Tooltip Content

**User Story:** As a customer, I want each guided tour tooltip to provide a brief, clear, and friendly description, so that I can quickly understand the purpose of each feature area.

#### Acceptance Criteria

1. THE System SHALL display Tooltip text limited to a maximum of 2 sentences and no more than 100 characters per Tour_Step
2. THE System SHALL use second-person voice (e.g., "You can...") and action-oriented language in all Tooltip content
3. THE List_Page Quick Search Tooltip SHALL describe the ability to search by Shipment No., HBL, MBL, Container No., BOL, or Load#
4. THE List_Page Recent Searches Tooltip SHALL describe the ability to quickly revisit previously searched shipments
5. THE List_Page Risk Alert Cards Tooltip SHALL describe the at-a-glance view of shipments requiring attention across Customs Hold, Approaching LFD, LFD Exceeded, and Warehouse Receiving categories
6. THE List_Page Status Tabs Tooltip SHALL describe the ability to filter shipments by current tracking status
7. THE List_Page Shipment Table Tooltip SHALL describe the comprehensive shipment information display including status, containers, origin, destination, and ETA
8. THE Overview_Tab Info Panel Tooltip SHALL describe the shipment basic information display area
9. THE Overview_Tab Progress Bar Tooltip SHALL describe the overall shipment journey completion visualization
10. THE Overview_Tab Timeline Tooltip SHALL describe the business milestone timeline showing phase-by-phase tracking
11. THE Overview_Tab Shipment Journey Map Tooltip SHALL describe the shipment journey route visualization on a map, showing the travel path from origin to destination

### Requirement 10: Visual Presentation of Guided Tour

**User Story:** As a customer, I want the guided tour overlay to be visually clear and non-intrusive, so that I can focus on the highlighted area without distraction.

#### Acceptance Criteria

1. THE Overlay_Mask SHALL use a semi-transparent dark background with opacity between 0.4 and 0.6
2. THE Highlight_Region SHALL appear as a cutout in the Overlay_Mask with border-radius between 4px and 8px and a visible box-shadow or border of at least 1px
3. THE Curved_Arrow SHALL be rendered as a bezier curved line with a triangular arrowhead pointing toward the Highlight_Region
4. THE Tooltip SHALL be positioned with a gap of 8px to 16px from the Highlight_Region edge without overlapping the highlighted content
5. WHEN transitioning between Tour_Steps, THE System SHALL apply a smooth animation lasting between 200ms and 400ms
6. IF the Tooltip would overflow the viewport boundary, THEN THE System SHALL reposition the Tooltip to the opposite side of the Highlight_Region to remain fully visible

### Requirement 11: Tour State Persistence

**User Story:** As a customer, I want the system to remember my tour completion status, so that I do not see the same guided tour again on future visits.

#### Acceptance Criteria

1. WHEN the List_Page Guided_Tour completes, THE System SHALL store the List_Page tour completion status in localStorage
2. WHEN the Detail_Page Guided_Tour completes, THE System SHALL store the Detail_Page tour completion status in localStorage
3. WHILE the List_Page tour completion status exists in localStorage, THE System SHALL skip the List_Page Guided_Tour on subsequent visits
4. WHILE the Detail_Page tour completion status exists in localStorage, THE System SHALL skip the Detail_Page Guided_Tour on subsequent visits
5. IF localStorage is unavailable when attempting to store or read tour completion status, THEN THE System SHALL skip the Guided_Tour and allow normal page access
