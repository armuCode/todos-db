import prisma from "@/lib/prisma";
import { Todo } from "@prisma/client";
import { get } from "http";
import { NextResponse, NextRequest } from "next/server";
import { boolean, object, string } from "yup";

interface Segments {
  params: {
    id: string;
  };
}

const getTodo = async (id: string): Promise<Todo | null> => {
  const todo = await prisma.todo.findFirst({ where: { id } });
  return todo;
};

export async function GET(request: Request, { params }: Segments) {
  const { id } = params;
  const todo = await getTodo(id);
  if (!todo) {
    return NextResponse.json(
      {
        message: `Todo con id ${params.id} no existe`,
      },
      { status: 404 }
    );
  }
  return NextResponse.json(params.id);
}

const putSchema = object({
  complete: boolean().optional(),
  description: string().optional(),
});

export async function PUT(request: Request, { params }: Segments) {
  const { id } = params;
  const todo = await getTodo(id);
  if (!todo) {
    return NextResponse.json(
      {
        message: `Todo con id ${id} no existe`,
      },
      { status: 404 }
    );
  }

  const { complete, description } = await putSchema.validate(
    await request.json()
  );

  const updateTodo = await prisma.todo.update({
    where: { id: params.id },
    data: { complete, description },
  });
  return NextResponse.json(updateTodo);
}
