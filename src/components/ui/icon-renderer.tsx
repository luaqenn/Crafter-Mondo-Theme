"use client";

import React from "react";
import * as LucideIcons from "lucide-react";

interface IconRendererProps {
  iconName: string;
  className?: string;
  size?: number;
}

// Lucide icon names (excluding internal icons and types)
const ICON_NAMES = [
  "Activity", "Airplay", "AlertCircle", "AlertOctagon", "AlertTriangle", "AlignCenter", "AlignJustify", "AlignLeft", "AlignRight",
  "Anchor", "Aperture", "Archive", "ArrowDown", "ArrowDownCircle", "ArrowDownLeft", "ArrowDownRight", "ArrowLeft", "ArrowLeftCircle",
  "ArrowLeftRight", "ArrowRight", "ArrowRightCircle", "ArrowUp", "ArrowUpCircle", "ArrowUpDown", "ArrowUpLeft", "ArrowUpRight",
  "AtSign", "Award", "BarChart", "BarChart2", "BarChart3", "BarChart4", "Battery", "BatteryCharging", "Bell", "BellOff",
  "Bluetooth", "Bold", "Book", "BookOpen", "Bookmark", "Box", "Briefcase", "Calendar", "Camera", "Cast", "Check", "CheckCircle",
  "CheckSquare", "ChevronDown", "ChevronLeft", "ChevronRight", "ChevronUp", "ChevronsDown", "ChevronsLeft", "ChevronsRight", "ChevronsUp",
  "Circle", "Clipboard", "Clock", "Cloud", "CloudDrizzle", "CloudFog", "CloudHail", "CloudLightning", "CloudOff", "CloudRain",
  "CloudSnow", "Code", "Codepen", "Codesandbox", "Coffee", "Columns", "Command", "Compass", "Copy", "CornerDownLeft", "CornerDownRight",
  "CornerLeftDown", "CornerLeftUp", "CornerRightDown", "CornerRightUp", "CornerUpLeft", "CornerUpRight", "Cpu", "CreditCard", "Crop",
  "Crosshair", "Database", "Delete", "Disc", "DollarSign", "Download", "DownloadCloud", "Droplets", "Edit", "Edit2", "Edit3",
  "Eye", "EyeOff", "Facebook", "FastForward", "Feather", "File", "FileText", "Film", "Filter", "Flag", "Folder", "FolderPlus",
  "Gift", "GitBranch", "GitCommit", "GitMerge", "GitPullRequest", "Github", "Gitlab", "Globe", "Grid", "Hash", "Headphones",
  "Heart", "HelpCircle", "Hexagon", "Home", "Image", "Inbox", "Info", "Instagram", "Italic", "Key", "Layers", "Layout",
  "LifeBuoy", "Link", "Link2", "List", "Loader", "Lock", "LogIn", "LogOut", "Mail", "Map", "MapPin", "Maximize", "Maximize2",
  "Menu", "MessageCircle", "MessageSquare", "Mic", "MicOff", "Minimize", "Minimize2", "Monitor", "Moon", "MoreHorizontal",
  "MoreVertical", "Move", "Music", "Navigation", "Navigation2", "Octagon", "Package", "Paperclip", "Pause", "PauseCircle",
  "Percent", "Phone", "PhoneCall", "PhoneForwarded", "PhoneIncoming", "PhoneMissed", "PhoneOff", "PhoneOutgoing", "PieChart",
  "Play", "PlayCircle", "Plus", "PlusCircle", "PlusSquare", "Pocket", "Power", "Printer", "Radio", "RefreshCcw", "RefreshCw",
  "Repeat", "Rewind", "RotateCcw", "RotateCw", "Rss", "Save", "Scissors", "Search", "Send", "Server", "Settings", "Share",
  "Share2", "Shield", "ShieldOff", "ShoppingBag", "ShoppingCart", "Shuffle", "Sidebar", "SkipBack", "SkipForward", "Slack",
  "Slash", "Sliders", "Smartphone", "Speaker", "Square", "Star", "StopCircle", "Sun", "Sunrise", "Sunset", "Tablet", "Tag",
  "Target", "Terminal", "Thermometer", "ThumbsDown", "ThumbsUp", "ToggleLeft", "ToggleRight", "ToolCase", "Trash", "Trash2",
  "Trello", "TrendingDown", "TrendingUp", "Triangle", "Truck", "Tv", "Twitch", "Twitter", "Type", "Umbrella", "Underline",
  "Unlock", "Upload", "UploadCloud", "User", "UserCheck", "UserMinus", "UserPlus", "UserX", "Users", "Video", "VideoOff",
  "Voicemail", "Volume", "Volume1", "Volume2", "VolumeX", "Watch", "Wifi", "WifiOff", "Wind", "X", "XCircle", "XSquare",
  "Youtube", "Zap", "ZapOff", "ZoomIn", "ZoomOut", "Ticket"
];

export const IconRenderer: React.FC<IconRendererProps> = ({
  iconName,
  className = "w-5 h-5",
  size
}) => {
  // Check if the icon name exists in our list
  if (!ICON_NAMES.includes(iconName)) {
    console.warn(`Icon "${iconName}" not found. Available icons:`, ICON_NAMES);
    return null;
  }

  // Get the icon component from Lucide
  const IconComponent = (LucideIcons as any)[iconName];
  
  if (!IconComponent) {
    console.warn(`Icon component "${iconName}" not found in Lucide icons`);
    return null;
  }

  // Apply size if provided, otherwise use className
  const iconClassName = size ? `w-${size} h-${size}` : className;

  return React.createElement(IconComponent, { 
    className: iconClassName 
  });
};

// Export the icon names for reference
export { ICON_NAMES }; 