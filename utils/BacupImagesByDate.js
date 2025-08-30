import { v2 as cloudinary } from "cloudinary";
import archiver from "archiver";
import axios from "axios";

// Backup marketing images by date range
export const backupMarketingImages = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "Start and end dates are required" });
    }

    const startDate = start.slice(0, 10);
    const endDate = end.slice(0, 10);

    let allResources = [];
    let nextCursor = null;

    do {
      const response = await cloudinary.search
        .expression(
          `folder:marketing/clients AND created_at>=${startDate} AND created_at<=${endDate}`
        )
        .sort_by("created_at", "asc")
        .max_results(100)
        .next_cursor(nextCursor)
        .execute();
      console.log(response, "response");

      allResources.push(...response.resources);
      nextCursor = response.next_cursor;
    } while (nextCursor);

    if (allResources.length === 0) {
      return res
        .status(200)
        .json({ message: "No images found in the given date range." });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=marketing_backup.zip"
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (const image of allResources) {
      try {
        const response = await axios.get(image.secure_url, {
          responseType: "arraybuffer",
        });
        const buffer = Buffer.from(response.data, "binary");
        const filename = image.public_id.split("/").pop() + "." + image.format;
        archive.append(buffer, { name: filename });
      } catch (err) {
        console.error("Failed to download image:", image.secure_url);
      }
    }

    archive.finalize();
  } catch (error) {
    console.error("Marketing Backup Error:", error);
    res.status(500).json({ message: "Failed to create backup." });
  }
};

// Backup all marketing images
export const fullBackupMarketingImages = async (req, res) => {
  try {
    let allResources = [];
    let nextCursor = null;

    do {
      const response = await cloudinary.search
        .expression("folder:marketing/*")
        .sort_by("created_at", "asc")
        .max_results(100)
        .next_cursor(nextCursor)
        .execute();

      allResources.push(...response.resources);
      nextCursor = response.next_cursor;
    } while (nextCursor);

    if (allResources.length === 0) {
      return res
        .status(200)
        .json({ message: "No images found in Cloudinary." });
    }

    res.setHeader("Content-Type", "application/zip");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=marketing_full_backup.zip"
    );

    const archive = archiver("zip", { zlib: { level: 9 } });
    archive.pipe(res);

    for (const image of allResources) {
      try {
        const response = await axios.get(image.secure_url, {
          responseType: "arraybuffer",
        });
        const buffer = Buffer.from(response.data, "binary");
        const filename = image.public_id.split("/").pop() + "." + image.format;
        archive.append(buffer, { name: filename });
      } catch (err) {
        console.error("Failed to download image:", image.secure_url);
      }
    }

    archive.finalize();
  } catch (error) {
    console.error("Marketing Full Backup Error:", error);
    res.status(500).json({ message: "Failed to create full backup." });
  }
};

// Delete marketing images by date range
export const deleteMarketingImagesByDate = async (req, res) => {
  try {
    const { start, end } = req.query;

    if (!start || !end) {
      return res
        .status(400)
        .json({ message: "Start and end dates are required" });
    }

    const startDate = start.slice(0, 10);
    const endDate = end.slice(0, 10);

    let allPublicIds = [];
    let nextCursor = null;

    do {
      const response = await cloudinary.search
        .expression(
          `folder:marketing/clients AND created_at>=${startDate} AND created_at<=${endDate}`
        )
        .sort_by("created_at", "asc")
        .max_results(100)
        .next_cursor(nextCursor)
        .execute();

      allPublicIds.push(...response.resources.map((img) => img.public_id));
      nextCursor = response.next_cursor;
    } while (nextCursor);

    if (allPublicIds.length === 0) {
      return res
        .status(200)
        .json({ message: "No images found in given range." });
    }

    const deleteResult = await cloudinary.api.delete_resources(allPublicIds);

    res.status(200).json({
      message: "Images deleted successfully",
      deleted: deleteResult,
    });
  } catch (error) {
    console.error("Delete by date error:", error);
    res.status(500).json({ message: "Failed to delete images." });
  }
};

// Delete all marketing images
export const deleteAllMarketingImages = async (req, res) => {
  try {
    let allPublicIds = [];
    let nextCursor = null;

    do {
      const response = await cloudinary.search
        .expression("folder:marketing/*")
        .max_results(100)
        .next_cursor(nextCursor)
        .execute();

      allPublicIds.push(...response.resources.map((img) => img.public_id));
      nextCursor = response.next_cursor;
    } while (nextCursor);

    if (allPublicIds.length === 0) {
      return res
        .status(200)
        .json({ message: "No images found in Cloudinary." });
    }

    const deleteResult = await cloudinary.api.delete_resources(allPublicIds);

    res.status(200).json({
      message: "All images deleted successfully",
      deleted: deleteResult,
    });
  } catch (error) {
    console.error("Delete all error:", error);
    res.status(500).json({ message: "Failed to delete all images." });
  }
};
