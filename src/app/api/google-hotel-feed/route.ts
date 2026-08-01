import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "json";

    const rooms = await prisma.room.findMany({
      orderBy: { order: "asc" },
    });

    const minPrice = rooms.length > 0 ? Math.min(...rooms.map((r) => r.price)) : 1000;
    const now = new Date().toISOString();

    if (format === "xml") {
      const xmlRooms = rooms
        .map(
          (room) => `
    <Result>
      <Property>zatoka_hotel</Property>
      <RoomID>${room.slug || room.id}</RoomID>
      <Name><![CDATA[${room.name}]]></Name>
      <Capacity>${room.capacity}</Capacity>
      <Package>
        <Occupancy>${room.capacity}</Occupancy>
        <ChargeCurrency>UAH</ChargeCurrency>
        <Baserate>${room.price}</Baserate>
        <Tax>0</Tax>
        <OtherFees>0</OtherFees>
      </Package>
      <URL>https://www.zatoka-hotel.com/ru/booking/${room.slug || room.id}</URL>
    </Result>`
        )
        .join("");

      const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<Transaction timestamp="${now}" partner="zatoka-hotel">
  <PropertyDataSet>
    <Property>zatoka_hotel</Property>
    <Name>Отель "Отдых в Затоке"</Name>
    <Address>ул. Садовая, 1835, Затока, Одесская область, Украина</Address>
    <Currency>UAH</Currency>
    <MinPrice>${minPrice}</MinPrice>
  </PropertyDataSet>
  ${xmlRooms}
</Transaction>`;

      return new Response(xmlContent, {
        headers: {
          "Content-Type": "application/xml; charset=utf-8",
          "Cache-Control": "public, max-age=3600, s-maxage=3600",
        },
      });
    }

    // Default JSON Format
    const jsonFeed = {
      hotel: {
        id: "zatoka_hotel",
        name: "Отель \"Отдых в Затоке\"",
        address: "ул. Садовая, 1835, Затока, Одесская область, Украина",
        currency: "UAH",
        website: "https://www.zatoka-hotel.com",
        minPricePerNight: minPrice,
      },
      updatedAt: now,
      rooms: rooms.map((room) => ({
        id: room.id,
        slug: room.slug,
        name: room.name,
        capacity: room.capacity,
        pricePerNight: room.price,
        currency: "UAH",
        bookingUrl: `https://www.zatoka-hotel.com/ru/booking/${room.slug || room.id}`,
        imageUrl: room.imageUrl,
        amenities: room.amenities,
      })),
    };

    return NextResponse.json(jsonFeed, {
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    });
  } catch (error) {
    console.error("Error generating Google Hotel Feed:", error);
    return NextResponse.json(
      { error: "Failed to generate Google Hotel Feed" },
      { status: 500 }
    );
  }
}
